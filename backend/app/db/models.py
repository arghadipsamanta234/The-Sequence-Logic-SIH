from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class AnalysisStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    PARTIAL = "PARTIAL"

class ServiceStatus(str, Enum):
    CONNECTED = "CONNECTED"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
    ADAPTER_PLACEHOLDER = "ADAPTER_PLACEHOLDER"
    NOT_EVALUATED = "NOT_EVALUATED"

class MethodType(str, Enum):
    REAL_API = "REAL_API"
    LOCAL_BIOPYTHON = "LOCAL_BIOPYTHON"
    LOCAL_FALLBACK = "LOCAL_FALLBACK"
    BENCHMARK_REFERENCE = "BENCHMARK_REFERENCE"
    NOT_AVAILABLE = "NOT_AVAILABLE"

# --- Provenance Base / Entity ---
class ProvenanceRecord(SQLModel, table=True):
    __tablename__ = "provenance_records"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: Optional[int] = Field(default=None, foreign_key="analysis_runs.id")
    stage_name: str
    source: str # e.g. "UniProt", "NCBI", "Local Biopython", "ESMFold API"
    accession: Optional[str] = None # e.g. "P0DTC2"
    method: str # e.g. "Real API Query", "Local ACC z-scale", "Biopython ProtParam"
    method_type: MethodType = MethodType.LOCAL_BIOPYTHON
    tool: str # e.g. "Biopython", "UniProt REST API", "VaxiJen Adapter"
    tool_version: str # e.g. "1.84", "v2.0", "1.0.0"
    parameters: str = "{}" # JSON serialized parameters
    input_hash: Optional[str] = None # SHA-256 of input sequence/data
    output_hash: Optional[str] = None # SHA-256 of output/results
    status: ServiceStatus = ServiceStatus.CONNECTED
    notes: Optional[str] = None # Explicit disclaimer if fallback or unavailable
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# --- Core Biological Entities ---
class Pathogen(SQLModel, table=True):
    __tablename__ = "pathogens"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tax_id: Optional[int] = None
    scientific_name: str # e.g. "Severe acute respiratory syndrome coronavirus 2"
    common_name: Optional[str] = None # e.g. "SARS-CoV-2"
    lineage: Optional[str] = None # e.g. "Viruses; Riboviria; Orthocoronavirinae"
    pathogen_type: str = "Virus" # "Virus", "Bacterium", "Parasite"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    proteins: List["Protein"] = Relationship(back_populates="pathogen")

class Protein(SQLModel, table=True):
    __tablename__ = "proteins"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    pathogen_id: Optional[int] = Field(default=None, foreign_key="pathogens.id")
    name: str # e.g. "Spike glycoprotein"
    gene_symbol: Optional[str] = None # e.g. "S"
    accession: str # e.g. "P0DTC2" or "NC_045512.2"
    source_db: str = "UniProt" # "UniProt", "NCBI", "User_Upload"
    organism: Optional[str] = None
    function_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    pathogen: Optional[Pathogen] = Relationship(back_populates="proteins")
    sequences: List["Sequence"] = Relationship(back_populates="protein")

class Sequence(SQLModel, table=True):
    __tablename__ = "sequences"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    protein_id: Optional[int] = Field(default=None, foreign_key="proteins.id")
    raw_sequence: str
    sequence_length: int
    is_valid_iupac: bool = True
    sha256_hash: str
    molecular_weight: Optional[float] = None
    isoelectric_point: Optional[float] = None
    gravy_score: Optional[float] = None
    instability_index: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    protein: Optional[Protein] = Relationship(back_populates="sequences")
    analysis_runs: List["AnalysisRun"] = Relationship(back_populates="sequence")

# --- Analysis & Workflow Run ---
class AnalysisRun(SQLModel, table=True):
    __tablename__ = "analysis_runs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sequence_id: int = Field(foreign_key="sequences.id")
    title: str
    description: Optional[str] = None
    status: AnalysisStatus = AnalysisStatus.PENDING
    current_stage: int = 1 # 1 to 9
    total_stages: int = 9
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    sequence: Optional[Sequence] = Relationship(back_populates="analysis_runs")
    antigenicity_results: List["AntigenicityResult"] = Relationship(back_populates="analysis_run")
    epitopes: List["Epitope"] = Relationship(back_populates="analysis_run")
    constructs: List["Construct"] = Relationship(back_populates="analysis_run")
    reports: List["Report"] = Relationship(back_populates="analysis_run")

# --- Scientific Evaluation Models ---
class AntigenicityResult(SQLModel, table=True):
    __tablename__ = "antigenicity_results"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(foreign_key="analysis_runs.id")
    tool: str # e.g. "VaxiJen Adapter", "ANTIGENpro Adapter", "Local ACC z-scale"
    tool_version: str = "v1.0"
    execution_method: str # Explicit: e.g. "VaxiJen v2.0 Remote API", "Local ACC Descriptor Fallback"
    score: Optional[float] = None # None if Not Evaluated
    threshold: float = 0.40
    is_antigenic: Optional[bool] = None # None if Not Evaluated
    status: ServiceStatus = ServiceStatus.CONNECTED
    provenance_note: str # Crucial integrity note
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    analysis_run: Optional[AnalysisRun] = Relationship(back_populates="antigenicity_results")

class Epitope(SQLModel, table=True):
    __tablename__ = "epitopes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(foreign_key="analysis_runs.id")
    epitope_type: str # "CTL_MHC_I", "HTL_MHC_II", "LINEAR_B_CELL"
    peptide_sequence: str
    start_pos: int
    end_pos: int
    length: int
    allele_target: Optional[str] = None # e.g. "HLA-A*02:01", "HLA-DRB1*01:01"
    score: Optional[float] = None
    percentile_rank: Optional[float] = None
    ic50_nm: Optional[float] = None
    prediction_tool: str # "IEDB NetMHCpan API", "Local Kolaskar-Tongaonkar", "Local Parker"
    execution_method: str
    status: ServiceStatus = ServiceStatus.CONNECTED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    analysis_run: Optional[AnalysisRun] = Relationship(back_populates="epitopes")
    safety_result: Optional["SafetyResult"] = Relationship(back_populates="epitope")

class SafetyResult(SQLModel, table=True):
    __tablename__ = "safety_results"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    epitope_id: int = Field(foreign_key="epitopes.id")
    is_allergen: Optional[bool] = None
    allergen_score: Optional[float] = None
    allergen_method: str = "FAO/WHO 6-mer rule & Allergen similarity scan"
    is_toxic: Optional[bool] = None
    toxic_score: Optional[float] = None
    toxic_method: str = "ToxinPred dipeptide rule scan"
    is_human_mimic: Optional[bool] = None
    human_homology_evalue: Optional[float] = None
    safety_cleared: bool = True
    status: ServiceStatus = ServiceStatus.CONNECTED
    provenance_note: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    epitope: Optional[Epitope] = Relationship(back_populates="safety_result")

class Construct(SQLModel, table=True):
    __tablename__ = "constructs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(foreign_key="analysis_runs.id")
    name: str # e.g. "Construct-Alpha-1"
    adjuvant_name: str # e.g. "50S ribosomal protein L7/L12"
    adjuvant_sequence: Optional[str] = None
    linker_configuration: str # e.g. "EAAAK + AAY + GPGPG + KK + 6xHis"
    full_sequence: str
    length: int
    molecular_weight: Optional[float] = None
    theoretical_pi: Optional[float] = None
    instability_index: Optional[float] = None
    aliphatic_index: Optional[float] = None
    gravy_score: Optional[float] = None
    solubility_score: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    analysis_run: Optional[AnalysisRun] = Relationship(back_populates="constructs")
    structure: Optional["Structure"] = Relationship(back_populates="construct")
    docking_results: List["DockingResult"] = Relationship(back_populates="construct")
    candidate_score: Optional["CandidateScore"] = Relationship(back_populates="construct")

class Structure(SQLModel, table=True):
    __tablename__ = "structures"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    construct_id: int = Field(foreign_key="constructs.id")
    source: str # "AlphaFold DB", "ESMFold API", "RCSB PDB Homology", "Template Reference"
    accession_or_model: str # e.g. "P0DTC2", "ESM-2_3B", "6VXX"
    pdb_file_path: Optional[str] = None
    pdb_content: Optional[str] = None
    confidence_plddt: Optional[float] = None
    status: ServiceStatus = ServiceStatus.CONNECTED
    execution_method: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    construct: Optional[Construct] = Relationship(back_populates="structure")

class DockingResult(SQLModel, table=True):
    __tablename__ = "docking_results"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    construct_id: int = Field(foreign_key="constructs.id")
    receptor_name: str # e.g. "Human TLR4 / MD-2 complex (PDB: 3FXI)"
    binding_energy_kcal_mol: Optional[float] = None
    kd_dissociation_constant_molar: Optional[float] = None
    hydrogen_bonds_count: Optional[int] = None
    docking_method: str # "AutoDock Vina Adapter", "Benchmark Verified Receptor Complex"
    docking_status: ServiceStatus = ServiceStatus.CONNECTED
    md_simulation_mode: str = "HPC_PACKAGE_EXPORT" # "HPC_PACKAGE_EXPORT", "BENCHMARK_TRAJECTORY_DEMO", "SERVICE_UNAVAILABLE"
    md_rmsd_mean_nm: Optional[float] = None
    md_rmsf_mean_nm: Optional[float] = None
    provenance_note: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    construct: Optional[Construct] = Relationship(back_populates="docking_results")

class CandidateScore(SQLModel, table=True):
    __tablename__ = "candidate_scores"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    construct_id: int = Field(foreign_key="constructs.id")
    rank: int = 1
    immunogenicity_score: float = 0.0 # 0.0 to 100.0
    safety_score: float = 0.0
    stability_score: float = 0.0
    population_coverage_percent: float = 0.0
    docking_affinity_score: float = 0.0
    composite_pareto_score: float = 0.0
    scoring_method: str = "Deterministic Multi-Criteria Decision Analysis (MCDA)"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    construct: Optional[Construct] = Relationship(back_populates="candidate_score")

class EvidenceSource(SQLModel, table=True):
    __tablename__ = "evidence_sources"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    source_name: str # "NCBI Entrez", "UniProt", "IEDB", "RCSB PDB", "AlphaFold DB"
    url: str
    version_or_release: str
    status: ServiceStatus = ServiceStatus.CONNECTED
    description: str
    last_ping_at: Optional[datetime] = None

class Report(SQLModel, table=True):
    __tablename__ = "reports"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(foreign_key="analysis_runs.id")
    title: str
    format: str = "HTML" # "HTML", "PDF", "JSON"
    content_json: str = "{}"
    sha256_checksum: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    analysis_run: Optional[AnalysisRun] = Relationship(back_populates="reports")
