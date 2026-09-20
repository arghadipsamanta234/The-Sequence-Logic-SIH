import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "Sequence Logic"
    assert data["status"] == "OPERATIONAL"

def test_api_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["integrity_mode"] == "STRICT_PROVENANCE_ACTIVE"

def test_benchmarks_available():
    response = client.get("/api/v1/sequence/benchmarks")
    assert response.status_code == 200
    benchmarks = response.json()
    assert isinstance(benchmarks, list)
    assert len(benchmarks) >= 3 # SARS-CoV-2, Dengue, TB
    accessions = [b["accession"] for b in benchmarks]
    assert "P0DTC2" in accessions
    assert "P07564" in accessions
    assert "P9WNK5" in accessions

def test_sources_status_endpoint():
    response = client.get("/api/v1/sources/")
    assert response.status_code == 200
    sources = response.json()
    assert len(sources) >= 10
    tool_ids = [s["id"] for s in sources]
    assert "uniprot" in tool_ids
    assert "vaxijen" in tool_ids
    assert "gromacs" in tool_ids
