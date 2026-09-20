@echo off
echo ========================================================
echo Starting Sequence Logic FastAPI Scientific Backend
echo Environment: Python 3.12 + BioPython 1.88 + SQLModel
echo API: http://127.0.0.1:8000
echo Documentation: http://127.0.0.1:8000/docs
echo ========================================================
.\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
