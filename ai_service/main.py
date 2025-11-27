import asyncio
import base64
import json
import os
from pathlib import Path
from typing import Any, Dict, List

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

try:
    from openai import OpenAI
except Exception:  # pragma: no cover - optional dependency
    OpenAI = None

try:
    import oracledb
except Exception:  # pragma: no cover - optional dependency
    oracledb = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatQuery(BaseModel):
    prompt: str
    conversation: List[ChatMessage] = []


ALLOWED_PARAMS = [
    "patient_id",
    "patient_sex",
    "patient_size_m",
    "patient_age",
    "patient_weight",
    "file_name",
    "file_path",
    "series_description",
    "note_text",
    "image_position_x_min",
    "image_position_x_max",
    "image_position_y_min",
    "image_position_y_max",
    "image_position_z_min",
    "image_position_z_max",
]

JAVA_BACKEND_URL = os.getenv("JAVA_BACKEND_URL", "http://localhost:8080")
ORACLE_CFG = {
    "host": os.getenv("ORACLE_HOST", "localhost"),
    "port": int(os.getenv("ORACLE_PORT", "1521")),
    "service": os.getenv("ORACLE_SERVICE", "PDB_MRI"),
    "user": os.getenv("ORACLE_USER", ""),
    "password": os.getenv("ORACLE_PASSWORD", ""),
}
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if OpenAI and os.getenv("OPENAI_API_KEY") else None

app = FastAPI(
    title="ChatBotMedical AI Service",
    version="0.1.0",
    description="Natural language bridge to the patient search API backed by Oracle.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_params(raw: Dict[str, Any]) -> Dict[str, Any]:
    return {k: v for k, v in raw.items() if v not in (None, "", [])}


def heuristic_parse(prompt: str) -> Dict[str, Any]:
    # Lightweight extraction when OpenAI is unavailable
    lowered = prompt.lower()
    guess: Dict[str, Any] = {}
    if "female" in lowered or "woman" in lowered:
        guess["patient_sex"] = "F"
    if "male" in lowered or "man" in lowered:
        guess["patient_sex"] = "M"
    numbers = [token for token in prompt.replace(",", " ").split() if token.isdigit()]
    if numbers:
        guess["patient_id"] = numbers[0]
    return guess


async def parse_intent(prompt: str, history: List[ChatMessage]) -> Dict[str, Any]:
    base = {k: None for k in ALLOWED_PARAMS}
    if not openai_client:
        base.update(heuristic_parse(prompt))
        return base

    messages = [
        {
            "role": "system",
            "content": (
                "You map clinician questions to Oracle patient search parameters. "
                "Return JSON with keys: "
                "patient_id, patient_sex, patient_size_m, patient_age, patient_weight, "
                "file_name, file_path, series_description, note_text, "
                "image_position_x_min, image_position_x_max, "
                "image_position_y_min, image_position_y_max, "
                "image_position_z_min, image_position_z_max. "
                "Use null when information is not provided. "
                "Keep values concise (IDs as strings, sizes in meters, weights in kg)."
            ),
        }
    ]
    for item in history[-5:]:
        messages.append({"role": item.role, "content": item.content})
    messages.append({"role": "user", "content": prompt})

    try:
        completion = openai_client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            response_format={"type": "json_object"},
        )
        content = completion.choices[0].message.content or "{}"
        parsed = json.loads(content)
    except Exception:
        parsed = heuristic_parse(prompt)

    for allowed in list(parsed.keys()):
        if allowed not in ALLOWED_PARAMS:
            parsed.pop(allowed, None)
    base.update(parsed)
    return base


async def fetch_via_java(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    async with httpx.AsyncClient(base_url=JAVA_BACKEND_URL, timeout=60) as client:
        response = await client.get("/api/patient/search", params=clean_params(params))
        response.raise_for_status()
        payload = response.json()
        if isinstance(payload, dict) and "entity" in payload:
            return payload.get("entity") or []
        return payload if isinstance(payload, list) else []


def blob_like_to_base64(value: Any) -> Any:
    if oracledb and isinstance(value, oracledb.LOB):
        data = value.read()
        return base64.b64encode(data).decode() if data else None
    if isinstance(value, (bytes, bytearray, memoryview)):
        return base64.b64encode(bytes(value)).decode()
    return value


def fetch_via_oracle(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    if not oracledb:
        raise RuntimeError("oracledb is not installed")

    dsn = oracledb.makedsn(ORACLE_CFG["host"], ORACLE_CFG["port"], service_name=ORACLE_CFG["service"])
    sql = """
        SELECT *
        FROM TABLE(
            get_patient_information(
                :patient_id,
                :patient_sex,
                :patient_size_m,
                :patient_age,
                :patient_weight,
                :file_name,
                :file_path,
                :series_description,
                :note_text,
                :image_position_x_min,
                :image_position_x_max,
                :image_position_y_min,
                :image_position_y_max,
                :image_position_z_min,
                :image_position_z_max
            )
        )
    """
    # binds = clean_params(params)
    binds = {k: (v if v not in ("", [], {}) else None) for k, v in params.items()}


    with oracledb.connect(user=ORACLE_CFG["user"], password=ORACLE_CFG["password"], dsn=dsn) as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, binds)
            columns = [col[0].lower() for col in cursor.description]
            results: List[Dict[str, Any]] = []
            for row in cursor.fetchall():
                mapped = {col: blob_like_to_base64(val) for col, val in zip(columns, row)}
                results.append(mapped)
            return results


@app.post("/ai/search")
async def ai_patient_search(query: ChatQuery):
    structured = await parse_intent(query.prompt, query.conversation)
    try:
        results = await fetch_via_java(structured)
        source = "java-backend"
    except Exception as java_error:
        if ORACLE_CFG["user"] and ORACLE_CFG["password"]:
            results = await asyncio.to_thread(fetch_via_oracle, structured)
            source = "oracle-direct"
        else:
            raise HTTPException(status_code=502, detail=f"Java backend error: {java_error}") from java_error

    return {
        "structured_query": structured,
        "source": source,
        "results": results,
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "java_backend": JAVA_BACKEND_URL,
        "oracle_service": ORACLE_CFG["service"],
        "openai_configured": bool(openai_client),
    }


def create_app() -> FastAPI:
    return app
