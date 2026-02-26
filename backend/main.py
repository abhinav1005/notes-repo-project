from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ask

app = FastAPI(title="Knowledge Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:4173",   # Vite preview
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
