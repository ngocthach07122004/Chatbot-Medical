import json
import os
import psycopg2
from psycopg2.extras import execute_batch
from dotenv import load_dotenv
from tqdm import tqdm

# 1. Load environment variables
# Assumes .env is in the parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path=env_path)

# 2. DB Configuration
try:
    DB_CONFIG = {
        "host": os.getenv("DB_HOST_DOCTOR"),
        "port": os.getenv("POSTGRES_PORT_DOCTOR"), # 5601
        "database": os.getenv("POSTGRES_DB_DOCTOR"), # DoctorDb
        "user": os.getenv("POSTGRES_USER_DOCTOR"),
        "password": os.getenv("POSTGRES_PASSWORD_DOCTOR")
    }

    FILE_CORPUS = os.getenv("PATH_CORPUS_JSONL")
    FILE_PATIENTS = os.getenv("PATH_PATIENTS_JSON")

    print(f"DB Config: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
    print(f"Corpus File: {FILE_CORPUS}")
except Exception as e:
    print("Error loading .env file. Please check if .env exists and variables are set.")
    exit(1)

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def init_database():
    print("\nCreating tables (if not exist)...")
    conn = get_db_connection()
    cur = conn.cursor()
    with open("init.sql", "r", encoding="utf-8") as f:
        cur.execute(f.read())
    conn.commit()
    cur.close()
    conn.close()
    print("Database initialization successful!")

def import_corpus():
    if not os.path.exists(FILE_CORPUS):
        print(f"File not found: {FILE_CORPUS}. Skipping this step.")
        return

    # 17GB ~ 11.7 triệu dòng => 2GB ~ 1.4 triệu dòng
    LIMIT_LINES = 1_400_000

    print(f"\nStarting Corpus import (This may take a while)...")
    conn = get_db_connection()
    cur = conn.cursor()

    batch_size = 2000
    batch_data = []
    count = 0

    with open(FILE_CORPUS, 'r', encoding='utf-8') as f:
        # Thêm tham số total=LIMIT_LINES để thanh tiến trình hiển thị đúng % dự kiến
        for line in tqdm(f, desc="Importing Articles", unit=" lines", total=LIMIT_LINES):

            # KIỂM TRA ĐIỀU KIỆN DỪNG
            if count >= LIMIT_LINES:
                break

            try:
                doc = json.loads(line)
                # (id, title, content)
                batch_data.append((
                    doc.get('_id'),
                    doc.get('title', ''),
                    doc.get('text', '')
                ))

                if len(batch_data) >= batch_size:
                    query = """
                        INSERT INTO medical_article (id, title, content)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (id) DO NOTHING
                    """
                    execute_batch(cur, query, batch_data)
                    conn.commit()
                    batch_data = []
                count += 1
            except Exception as e:
                continue

        # Insert phần còn lại (nếu có)
        if batch_data:
            query = "INSERT INTO medical_article (id, title, content) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING"
            execute_batch(cur, query, batch_data)
            conn.commit()

    cur.close()
    conn.close()

    print(f"Imported {count} articles!")

def import_patients():
    if not os.path.exists(FILE_PATIENTS):
        print(f"File not found: {FILE_PATIENTS}. Skipping this step.")
        return

    print(f"\nStarting Patients import...")
    conn = get_db_connection()
    cur = conn.cursor()

    with open(FILE_PATIENTS, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cases_data = []
    relevance_data = []

    for item in tqdm(data, desc="Processing Patients"):
        # Extract age from array [[46.0, "year"]]
        age = None
        if item.get('age') and len(item['age']) > 0:
            try:
                age = float(item['age'][0][0])
            except:
                age = None

        case_id = item.get('human_patient_uid')

        # Data for research_case table
        cases_data.append((
            case_id,
            age,
            item.get('geneder'), # Keep original typo from json
            item.get('title'),
            item.get('patient')
        ))

        # Data for research_relevance table
        rel_articles = item.get('relevant_articles', {})
        for art_id, score in rel_articles.items():
            relevance_data.append((case_id, art_id, score))

    # Insert Cases
    q_case = """
        INSERT INTO research_case (id, age, gender, disease_name, description)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
    """
    execute_batch(cur, q_case, cases_data)

    # Insert Relevance
    q_rel = "INSERT INTO research_relevance (case_id, article_id, relevance_score) VALUES (%s, %s, %s)"
    execute_batch(cur, q_rel, relevance_data)

    conn.commit()
    cur.close()
    conn.close()
    print("Patients data import completed!")

def update_search_vector():
    print("\nUpdating Search Vector (Final step)...")
    conn = get_db_connection()
    cur = conn.cursor()
    # Update vector column for full-text search
    cur.execute("UPDATE medical_article SET search_vector = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')) WHERE search_vector IS NULL;")
    conn.commit()
    cur.close()
    conn.close()
    print("Index update completed!")

if __name__ == "__main__":
    init_database()
    import_corpus()
    import_patients()
    update_search_vector()
    print("\n--- ALL TASKS COMPLETED ---")