import axios from 'axios';
import type {
  BenchmarkDataset,
  FASTAValidationResponse,
  DataSourceItem,
  AnalysisDetailResponse
} from './types';

const API_BASE = 'https://the-sequence-logic-sih.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const api = {
  // Sequence & Benchmarks
  getBenchmarks: async (): Promise<BenchmarkDataset[]> => {
    const res = await apiClient.get('/sequence/benchmarks');
    return res.data;
  },

  validateFASTA: async (fastaContent: string): Promise<FASTAValidationResponse> => {
    const res = await apiClient.post('/sequence/validate-fasta', {
      fasta_content: fastaContent,
    });
    return res.data;
  },

  fetchUniProt: async (accession: string) => {
    const res = await apiClient.get(`/sequence/uniprot/${accession}`);
    return res.data;
  },

  fetchNCBI: async (accession: string, db: string = 'protein') => {
    const res = await apiClient.get(`/sequence/ncbi/${accession}?db=${db}`);
    return res.data;
  },

  // Analysis & Workflow
  createAnalysis: async (payload: {
    title: string;
    description?: string;
    organism: string;
    pathogen_type: string;
    tax_id?: number;
    protein_name: string;
    gene_symbol?: string;
    accession: string;
    source_db: string;
    fasta_content: string;
    auto_run_pipeline?: boolean;
  }) => {
    const res = await apiClient.post('/analysis/create', payload);
    return res.data;
  },

  listAnalyses: async () => {
    const res = await apiClient.get('/analysis/');
    return res.data;
  },

  getAnalysisDetail: async (analysisId: number | string): Promise<AnalysisDetailResponse> => {
    const res = await apiClient.get(`/analysis/${analysisId}`);
    return res.data;
  },

  // Candidates & Structure
  getCandidateDetail: async (constructId: number | string) => {
    const res = await apiClient.get(`/candidates/detail/${constructId}`);
    return res.data;
  },

  // Reports
  getAnalysisReport: async (analysisId: number | string) => {
    const res = await apiClient.get(`/reports/${analysisId}`);
    return res.data;
  },

  // Sources & Adapters
  getDataSources: async (): Promise<DataSourceItem[]> => {
    const res = await apiClient.get('/sources/');
    return res.data;
  },

  // Health
  checkHealth: async () => {
    const res = await axios.get('https://the-sequence-logic-sih.onrender.com/health');
    return res.data;
  }
};
