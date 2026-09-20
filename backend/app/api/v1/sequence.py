import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.scientific.fasta_validator import validate_protein_fasta, FASTAValidationResult
from app.adapters.uniprot_adapter import UniProtAdapter
from app.adapters.ncbi_adapter import NCBIAdapter
from app.config import BENCHMARK_DIR

router = APIRouter(prefix="/sequence", tags=["Sequence & Ingestion"])

uniprot_adapter = UniProtAdapter()
ncbi_adapter = NCBIAdapter()

class FASTAValidationRequest(BaseModel):
    fasta_content: str

class ExternalQueryRequest(BaseModel):
    accession: str
    database: str = "uniprot" # "uniprot" or "ncbi"

@router.post("/validate-fasta", response_model=FASTAValidationResult)
async def validate_fasta_endpoint(request: FASTAValidationRequest):
    """
    Validates protein sequence using Biopython.
    Strictly enforces standard IUPAC amino acid alphabet and rejects invalid characters.
    """
    result = validate_protein_fasta(request.fasta_content)
    return result

@router.get("/benchmarks")
async def get_benchmark_datasets():
    """
    Returns verified peer-reviewed public benchmark pathogen presets
    (SARS-CoV-2 Spike, Dengue Envelope, M. tuberculosis ESAT-6).
    """
    benchmarks = []
    if BENCHMARK_DIR.exists():
        for file_path in BENCHMARK_DIR.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    benchmarks.append(json.load(f))
            except Exception:
                continue
    return benchmarks

@router.get("/uniprot/{accession}")
async def fetch_uniprot_record(accession: str):
    """Fetch real biological sequence and metadata from UniProt KB REST API."""
    result = await uniprot_adapter.execute(accession)
    if not result.is_operational and result.error_message:
        raise HTTPException(status_code=400, detail=result.error_message)
    return result

@router.get("/ncbi/{accession}")
async def fetch_ncbi_record(accession: str, db: str = "protein"):
    """Fetch real biological sequence and metadata from NCBI Entrez."""
    result = await ncbi_adapter.execute(accession, db=db)
    if not result.is_operational and result.error_message:
        raise HTTPException(status_code=400, detail=result.error_message)
    return result
