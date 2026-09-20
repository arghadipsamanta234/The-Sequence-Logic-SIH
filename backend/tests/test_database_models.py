import pytest
from sqlmodel import Session, create_engine, SQLModel, select
from app.db.models import (
    Pathogen, Protein, Sequence, AnalysisRun, AnalysisStatus,
    Construct, CandidateScore, Epitope, SafetyResult, ProvenanceRecord
)

@pytest.fixture
def in_memory_session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

def test_database_model_creation_and_relationships(in_memory_session: Session):
    # 1. Create Pathogen
    pathogen = Pathogen(scientific_name="SARS-CoV-2", pathogen_type="Virus", tax_id=2697049)
    in_memory_session.add(pathogen)
    in_memory_session.commit()
    in_memory_session.refresh(pathogen)
    assert pathogen.id is not None

    # 2. Create Protein
    protein = Protein(
        pathogen_id=pathogen.id,
        name="Spike glycoprotein",
        accession="P0DTC2",
        source_db="UniProtKB"
    )
    in_memory_session.add(protein)
    in_memory_session.commit()
    in_memory_session.refresh(protein)
    assert protein.id is not None
    assert protein.pathogen.scientific_name == "SARS-CoV-2"

    # 3. Create Sequence
    seq = Sequence(
        protein_id=protein.id,
        raw_sequence="MFVFLVLLPLVSSQC",
        sequence_length=15,
        is_valid_iupac=True,
        sha256_hash="dummyhash12345"
    )
    in_memory_session.add(seq)
    in_memory_session.commit()
    in_memory_session.refresh(seq)
    assert seq.id is not None

    # 4. Create AnalysisRun
    run = AnalysisRun(
        sequence_id=seq.id,
        title="Spike Test Pipeline",
        status=AnalysisStatus.PENDING
    )
    in_memory_session.add(run)
    in_memory_session.commit()
    in_memory_session.refresh(run)
    assert run.id is not None
    assert run.status == AnalysisStatus.PENDING

    # 5. Create Construct & CandidateScore
    construct = Construct(
        analysis_id=run.id,
        name="MEV-Candidate-01",
        adjuvant_name="50S L7/L12",
        linker_configuration="EAAAK + AAY + GPGPG",
        full_sequence="MAKLSTDEAAAKYLQPRTFLLAAY",
        length=24
    )
    in_memory_session.add(construct)
    in_memory_session.commit()
    in_memory_session.refresh(construct)

    score = CandidateScore(
        construct_id=construct.id,
        rank=1,
        immunogenicity_score=90.0,
        composite_pareto_score=92.5
    )
    in_memory_session.add(score)
    in_memory_session.commit()
    in_memory_session.refresh(score)
    assert score.id is not None
    assert score.composite_pareto_score == 92.5
