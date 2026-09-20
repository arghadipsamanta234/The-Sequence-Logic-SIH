from fastapi.testclient import TestClient
from app.main import app
from app.db.session import init_db

init_db()
client = TestClient(app)

def test_full_demo_workflow_with_real_sars_cov_2():
    # 1. Fetch benchmark dataset for SARS-CoV-2
    bench_res = client.get("/api/v1/sequence/benchmarks")
    assert bench_res.status_code == 200
    benchmarks = bench_res.json()
    sars = next(b for b in benchmarks if b["accession"] == "P0DTC2")
    
    # 2. Test FASTA validation
    val_res = client.post("/api/v1/sequence/validate-fasta", json={"fasta_content": f">{sars['accession']}\n{sars['sequence']}"})
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["is_valid"] is True
    assert val_data["length"] == len(sars["sequence"])
    assert len(val_data["sha256_hash"]) == 64

    # 3. Create New Analysis Run
    create_payload = {
        "title": "SARS-CoV-2 Spike Glycoprotein SIH Benchmark",
        "description": "Validation run for SIH 2026 prototype evaluation",
        "organism": sars["organism"],
        "pathogen_type": "Virus",
        "tax_id": sars["tax_id"],
        "protein_name": sars["name"],
        "gene_symbol": sars["gene_symbol"],
        "accession": sars["accession"],
        "source_db": sars["source_db"],
        "fasta_content": f">{sars['accession']}\n{sars['sequence']}",
        "auto_run_pipeline": True
    }
    create_res = client.post("/api/v1/analysis/create", json=create_payload)
    assert create_res.status_code == 200
    created = create_res.json()
    analysis_id = created["analysis_id"]
    assert analysis_id is not None
    assert created["accession"] == "P0DTC2"

    # 4. Fetch Analysis Detail & Pipeline Status
    detail_res = client.get(f"/api/v1/analysis/{analysis_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    
    assert detail["analysis"]["status"] == "COMPLETED"
    assert detail["analysis"]["current_stage"] == 9
    assert len(detail["provenance_records"]) >= 4
    assert len(detail["constructs"]) >= 1
    assert len(detail["epitopes"]) >= 4
    
    # Verify Candidate Results & Details
    candidate_id = detail["constructs"][0]["id"]
    cand_res = client.get(f"/api/v1/candidates/detail/{candidate_id}")
    assert cand_res.status_code == 200
    cand_data = cand_res.json()
    assert cand_data["candidate"]["name"] == "Candidate-MEV-01"
    assert "EAAAK" in cand_data["candidate"]["linker_configuration"]
    assert cand_data["docking"]["binding_energy_kcal_mol"] == -28.4
    
    # 5. Fetch Research Report & Checksum
    rep_res = client.get(f"/api/v1/reports/{analysis_id}")
    assert rep_res.status_code == 200
    rep_data = rep_res.json()
    assert len(rep_data["report_checksum_sha256"]) == 64
    assert "NOTICE OF SCIENTIFIC INTEGRITY" in rep_data["disclaimer"]
