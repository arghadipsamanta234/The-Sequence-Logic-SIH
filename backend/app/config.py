import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "data"
BENCHMARK_DIR = DATA_DIR / "benchmark_datasets"
DB_PATH = BASE_DIR / "sequence_logic.db"

class Settings(BaseModel):
    PROJECT_NAME: str = "Sequence Logic"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    ALLOW_ORIGIN_REGEX: str = ".*"

settings = Settings()
