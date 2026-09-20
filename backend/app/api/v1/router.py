from fastapi import APIRouter
from app.api.v1.sequence import router as sequence_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.candidates import router as candidates_router
from app.api.v1.reports import router as reports_router
from app.api.v1.sources import router as sources_router

api_router = APIRouter()
api_router.include_router(sequence_router)
api_router.include_router(analysis_router)
api_router.include_router(candidates_router)
api_router.include_router(reports_router)
api_router.include_router(sources_router)
