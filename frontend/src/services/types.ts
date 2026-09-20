export interface BenchmarkDataset {
  accession: string;
  source_db: string;
  name: string;
  gene_symbol?: string;
  organism: string;
  common_name?: string;
  tax_id?: number;
  lineage?: string;
  pdb_reference?: string;
  function_summary?: string;
  sequence: string;
  known_protective_epitopes?: Array<{
    type: string;
    peptide: string;
    start: number;
    end: number;
    allele: string;
    iedb_reference_id?: string;
  }>;
}

export interface FASTAValidationResponse {
  is_valid: boolean;
  sequence: string;
  header: string;
  length: number;
  sha256_hash: string;
  errors: string[];
  warnings: string[];
  is_nucleotide_suspect: boolean;
  molecular_weight?: number;
  isoelectric_point?: number;
  gravy?: number;
  instability_index?: number;
}

export interface DataSourceItem {
  id: string;
  name: string;
  category: string;
  url: string;
  type: string;
  status: 'CONNECTED' | 'SERVICE_UNAVAILABLE' | 'ADAPTER_PLACEHOLDER' | 'NOT_EVALUATED';
  is_local: boolean;
  description: string;
}

export interface ProvenanceRecord {
  id: number;
  stage_name: string;
  source: string;
  accession?: string;
  method: string;
  method_type: string;
  tool: string;
  tool_version: string;
  parameters: string;
  input_hash?: string;
  output_hash?: string;
  status: string;
  notes?: string;
  timestamp: string;
}

export interface CandidateConstruct {
  id: number;
  name: string;
  adjuvant: string;
  length: number;
  molecular_weight?: number;
  theoretical_pi?: number;
  instability_index?: number;
  aliphatic_index?: number;
  gravy_score?: number;
  solubility_score?: number;
  full_sequence: string;
  score?: {
    rank: number;
    composite_pareto_score: number;
    immunogenicity_score: number;
    safety_score: number;
    stability_score: number;
    population_coverage_percent: number;
    docking_affinity_score: number;
  };
  docking?: {
    receptor_name: string;
    binding_energy_kcal_mol: number;
    kd_dissociation_constant_molar: number;
    hydrogen_bonds_count: number;
    docking_method: string;
    md_simulation_mode: string;
    md_rmsd_mean_nm?: number;
    provenance_note: string;
  };
  structure?: {
    source: string;
    accession_or_model: string;
    confidence_plddt?: number;
    status?: string;
    execution_method: string;
    notes?: string;
  };
}

export interface AnalysisDetailResponse {
  analysis: {
    id: number;
    title: string;
    description?: string;
    status: string;
    current_stage: number;
    total_stages: number;
    created_at: string;
    updated_at: string;
  };
  sequence: {
    id?: number;
    length: number;
    sha256: string;
    raw_sequence: string;
    protein_name: string;
    accession: string;
    organism: string;
    physchem: {
      molecular_weight?: number;
      isoelectric_point?: number;
      gravy?: number;
      instability_index?: number;
    };
  };
  antigenicity_results: Array<{
    id: number;
    tool: string;
    tool_version: string;
    execution_method: string;
    score?: number;
    threshold: number;
    is_antigenic?: boolean;
    status: string;
    provenance_note: string;
  }>;
  epitopes: Array<{
    id: number;
    type: string;
    peptide: string;
    start: number;
    end: number;
    length: number;
    allele?: string;
    score?: number;
    percentile_rank?: number;
    tool: string;
    safety?: {
      is_allergen?: boolean;
      is_toxic?: boolean;
      safety_cleared: boolean;
      provenance_note: string;
    };
  }>;
  constructs: CandidateConstruct[];
  provenance_records: ProvenanceRecord[];
}
