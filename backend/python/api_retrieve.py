from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from retrieve import PaperRetriever

app = FastAPI()

# Request model
class SearchRequest(BaseModel):
    query: str
    top_k: int = 10
    metric_type: str = "COSINE"

# Response model
class PaperResult(BaseModel):
    pmid: str
    score: float
    distance: float

class SearchResponse(BaseModel):
    results: List[PaperResult]

# Khởi tạo retriever
retriever = PaperRetriever(
    model_path="./PAR/checkpoints/best_model.pt",
    use_pretrained=False
)

@app.post("/search", response_model=SearchResponse)
async def search_papers(request: SearchRequest):
    if retriever is None:
        raise HTTPException(status_code=503, detail="Retriever not initialized")

    try:
        results = retriever.search(
            patient_text=request.query,
            top_k=request.top_k,
            metric_type=request.metric_type
        )

        paper_results = [
            PaperResult(
                pmid=str(paper["pmid"]),
                score=paper["score"],
                distance=paper["distance"]
            )
            for paper in results
        ]

        return SearchResponse(results=paper_results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
