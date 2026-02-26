from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class AskRequest(BaseModel):
    query: str


class Source(BaseModel):
    entryId: str
    title: str
    type: str
    score: float


class AskResponse(BaseModel):
    answer: str
    sources: list[Source]


@router.post("/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    """
    RAG endpoint — to be implemented.

    Will:
    1. Embed the query with Voyage AI
    2. Find top-k similar entries from embeddings.json via cosine similarity
    3. Call Claude with the retrieved context
    4. Return the answer + source links
    """
    return AskResponse(
        answer="RAG is not yet implemented.",
        sources=[],
    )
