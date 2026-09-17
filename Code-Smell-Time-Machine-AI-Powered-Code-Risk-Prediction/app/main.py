from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes import auth, analyze

app = FastAPI(
    title="repo-analyzer",
    description="A tool for mining GitHub commits and predicting risk",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(analyze.router)


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/health")
async def health_check():
    return {"status": "ok"}
