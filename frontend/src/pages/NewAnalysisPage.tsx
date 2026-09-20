import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dna,
  Play,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import type { BenchmarkDataset, FASTAValidationResponse } from '../services/types';

export const NewAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetAccession = searchParams.get('preset');

  const [benchmarks, setBenchmarks] = useState<BenchmarkDataset[]>([]);
  const [title, setTitle] = useState('SARS-CoV-2 Spike Glycoprotein MEV Analysis');
  const [description, setDescription] = useState('SIH 2026 Immuno-informatics validation experiment');
  const [organism, setOrganism] = useState('Severe acute respiratory syndrome coronavirus 2');
  const [proteinName, setProteinName] = useState('Spike glycoprotein');
  const [accession, setAccession] = useState('P0DTC2');
  const [sourceDb, setSourceDb] = useState('UniProtKB');
  const [fastaContent, setFastaContent] = useState('');
  const [autoRun, setAutoRun] = useState(true);

  const [validation, setValidation] = useState<FASTAValidationResponse | null>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch benchmark datasets
  useEffect(() => {
    const loadBenchmarks = async () => {
      try {
        const data = await api.getBenchmarks();
        setBenchmarks(data);
        if (data.length > 0) {
          const defaultPreset = presetAccession
            ? data.find((b) => b.accession === presetAccession) || data[0]
            : data[0];
          applyPreset(defaultPreset);
        }
      } catch (err) {
        console.error('Failed to load benchmarks:', err);
      }
    };
    loadBenchmarks();
  }, [presetAccession]);

  const applyPreset = (preset: BenchmarkDataset) => {
    setTitle(`${preset.organism} ${preset.name} MEV Analysis`);
    setOrganism(preset.organism);
    setProteinName(preset.name);
    setAccession(preset.accession);
    setSourceDb(preset.source_db);
    const fasta = `>${preset.accession}|${preset.name}|${preset.organism}\n${preset.sequence}`;
    setFastaContent(fasta);
    setValidation(null);
    setErrorMsg(null);
  };

  const handleValidate = async () => {
    if (!fastaContent.trim()) {
      setErrorMsg('Please input a valid FASTA sequence.');
      return;
    }
    setValidating(true);
    setErrorMsg(null);
    try {
      const res = await api.validateFASTA(fastaContent);
      setValidation(res);
      if (!res.is_valid) {
        setErrorMsg(res.errors.join('; '));
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'FASTA validation failed.');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.createAnalysis({
        title,
        description,
        organism,
        pathogen_type: 'Virus',
        protein_name: proteinName,
        accession,
        source_db: sourceDb,
        fasta_content: fastaContent,
        auto_run_pipeline: autoRun,
      });
      navigate(`/pipeline/${res.analysis_id}`);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.detail?.message ||
        err.response?.data?.detail ||
        'Failed to create analysis run.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Initiate New Scientific Analysis</h2>
        <p className="text-sm text-slate-400 mt-1">
          Provide a real protein sequence or select a curated gold-standard benchmark pathogen.
        </p>
      </div>

      {/* Preset Quick Selection Buttons */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Select Gold-Standard Target</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {benchmarks.map((bench) => (
            <button
              key={bench.accession}
              type="button"
              onClick={() => applyPreset(bench)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left flex items-center gap-2 ${
                accession === bench.accession
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="font-semibold">{bench.accession}</span>
                <span className="text-slate-400 ml-1.5 font-normal">({bench.name})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Analysis Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Organism / Pathogen</label>
            <input
              type="text"
              value={organism}
              onChange={(e) => setOrganism(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Protein Name</label>
            <input
              type="text"
              value={proteinName}
              onChange={(e) => setProteinName(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Accession & Source DB</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={accession}
                onChange={(e) => setAccession(e.target.value)}
                required
                className="w-2/3 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={sourceDb}
                onChange={(e) => setSourceDb(e.target.value)}
                className="w-1/3 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="UniProtKB">UniProtKB</option>
                <option value="NCBI_Entrez">NCBI Entrez</option>
                <option value="User_Upload">User FASTA</option>
              </select>
            </div>
          </div>
        </div>

        {/* FASTA Sequence Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300">
              FASTA Protein Sequence (IUPAC Standard Amino Acids)
            </label>
            <button
              type="button"
              onClick={handleValidate}
              disabled={validating || !fastaContent.trim()}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium disabled:opacity-50"
            >
              {validating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating with Biopython...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Run Biopython Validation</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={8}
            value={fastaContent}
            onChange={(e) => {
              setFastaContent(e.target.value);
              setValidation(null);
            }}
            placeholder=">Accession|Header\nMFVFLVLLPLVSSQC..."
            required
            className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 selection:bg-emerald-500/30"
          />
        </div>

        {/* Validation Results Card */}
        {validation && (
          <div
            className={`p-4 rounded-xl border ${
              validation.is_valid
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-2">
              {validation.is_valid ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Sequence Conforms to IUPAC Protein Standards</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Sequence Validation Failed</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
              <div>
                <span className="text-slate-400">Length:</span>{' '}
                <span className="font-mono font-semibold">{validation.length} aa</span>
              </div>
              <div>
                <span className="text-slate-400">Mol. Weight:</span>{' '}
                <span className="font-mono font-semibold">
                  {validation.molecular_weight ? `${validation.molecular_weight} Da` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Isoelectric Point:</span>{' '}
                <span className="font-mono font-semibold">{validation.isoelectric_point ?? 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400">GRAVY Index:</span>{' '}
                <span className="font-mono font-semibold">{validation.gravy ?? 'N/A'}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/40 text-[11px] font-mono text-slate-400 break-all">
              SHA-256 Hash: {validation.sha256_hash}
            </div>

            {validation.warnings.length > 0 && (
              <div className="mt-2 text-xs text-amber-300">
                Warnings: {validation.warnings.join(' | ')}
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Automated Execution Toggle */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-medium text-white">Execute Full Pipeline Workflow</span>
            <p className="text-xs text-slate-400">
              Automatically runs Stages 2–8 (Antigenicity, Epitopes, Safety, Assembly, Docking) with honest provenance logging.
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Create & Execute Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
