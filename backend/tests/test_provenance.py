import pytest
from sqlmodel import Session, create_engine, SQLModel
from app.db.models import ProvenanceRecord, MethodType, ServiceStatus
from app.core.provenance import record_provenance, compute_sha256

@pytest.fixture
def in_memory_session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

def test_sha256_computation():
    input_str = "MFVFLVLLPLVSSQC"
    hash_val = compute_sha256(input_str)
    assert len(hash_val) == 64
    # Deterministic check
    assert hash_val == compute_sha256(input_str)

def test_provenance_creation_and_integrity(in_memory_session: Session):
    input_seq = "MFVFLVLLPLVSSQC"
    prov = record_provenance(
        session=in_memory_session,
        stage_name="Stage 1: Ingestion",
        source="UniProtKB",
        accession="P0DTC2",
        method="Biopython SeqIO IUPAC Validation",
        method_type=MethodType.LOCAL_BIOPYTHON,
        tool="Biopython",
        tool_version="1.88",
        parameters={"format": "fasta", "alphabet": "protein"},
        input_data=input_seq,
        output_data="VALID",
        status=ServiceStatus.CONNECTED,
        notes="Standard amino acid validation passed."
    )

    assert prov.id is not None
    assert prov.source == "UniProtKB"
    assert prov.method_type == MethodType.LOCAL_BIOPYTHON
    assert prov.input_hash == compute_sha256(input_seq)
    assert prov.output_hash == compute_sha256("VALID")
    assert prov.status == ServiceStatus.CONNECTED
    assert "format" in prov.parameters
