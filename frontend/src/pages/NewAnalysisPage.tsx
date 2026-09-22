import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dna,
  Play,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Loader2,
  Database,
  FileText,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import type {
  BenchmarkDataset,
  FASTAValidationResponse,
} from '../services/types';

export const NewAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetAccession = searchParams.get('preset');

  const [benchmarks, setBenchmarks] = useState<BenchmarkDataset[]>([]);
  const [title, setTitle] = useState(
    'SARS-CoV-2 Spike Glycoprotein MEV Analysis'
  );
  const [description, setDescription] = useState(
    'SIH 2026 Immuno-informatics validation experiment'
  );
  const [organism, setOrganism] = useState(
    'Severe acute respiratory syndrome coronavirus 2'
  );
  const [proteinName, setProteinName] = useState('Spike glycoprotein');
  const [accession, setAccession] = useState('P0DTC2');
  const [sourceDb, setSourceDb] = useState('UniProtKB');
  const [fastaContent, setFastaContent] = useState('');
  const [autoRun, setAutoRun] = useState(true);

  const [validation, setValidation] =
    useState<FASTAValidationResponse | null>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setErrorMsg(
        err.response?.data?.detail || 'FASTA validation failed.'
      );
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
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold mb-3">
            <FlaskConical className="w-3.5 h-3.5" />
            Analysis Workspace
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900">
            Initiate New Scientific Analysis
          </h2>

          <p className="text-sm text-ink-500 mt-2 max-w-2xl leading-relaxed">
            Provide a real protein sequence or select a curated benchmark
            pathogen to initialize the reverse-vaccinology workflow.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-blue-100 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-brand-500" />
          <div>
            <p className="text-xs font-semibold text-ink-800">
              Provenance-aware workflow
            </p>
            <p className="text-[11px] text-ink-500">
              Sequence validation enabled
            </p>
          </div>
        </div>
      </div>

      {/* Quick Select */}
      <section className="soft-card overflow-hidden">
        <div className="px-5 py-4 border-b border-blue-100 bg-gradient-to-r from-white to-surface-blue">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-brand-500" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink-900">
                Quick Select Gold-Standard Target
              </h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Load a curated benchmark dataset and populate the analysis
                fields automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {benchmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {benchmarks.map((bench) => {
                const selected = accession === bench.accession;

                return (
                  <button
                    key={bench.accession}
                    type="button"
                    onClick={() => applyPreset(bench)}
                    className={`group text-left rounded-xl border p-4 transition-all duration-200 ${
                      selected
                        ? 'bg-brand-50 border-brand-300 shadow-sm'
                        : 'bg-white border-blue-100 hover:border-brand-200 hover:bg-surface-blue'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-brand-100 text-brand-600'
                            : 'bg-surface-muted text-brand-500'
                        }`}
                      >
                        <Dna className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-700">
                            {bench.accession}
                          </span>

                          {selected && (
                            <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                          )}
                        </div>

                        <p className="text-sm font-semibold text-ink-900 mt-1 truncate">
                          {bench.name}
                        </p>

                        <p className="text-[11px] text-ink-500 mt-0.5 truncate">
                          {bench.organism}
                        </p>
                      </div>

                      <ArrowRight
                        className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                          selected
                            ? 'text-brand-500'
                            : 'text-ink-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-ink-500">
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              Loading benchmark datasets...
            </div>
          )}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Analysis Metadata */}
        <section className="soft-card overflow-hidden">
          <div className="px-5 py-4 border-b border-blue-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-brand-500" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-900">
                  Analysis Metadata
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Identify the target sequence and its biological source.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-2">
                Analysis Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-2">
                Organism / Pathogen
              </label>
              <input
                type="text"
                value={organism}
                onChange={(e) => setOrganism(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-2">
                Protein Name
              </label>
              <input
                type="text"
                value={proteinName}
                onChange={(e) => setProteinName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ink-700 mb-2">
                Primary Accession & Source Database
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-2.5">
                <input
                  type="text"
                  value={accession}
                  onChange={(e) => setAccession(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 text-sm font-mono text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition"
                />

                <select
                  value={sourceDb}
                  onChange={(e) => setSourceDb(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition"
                >
                  <option value="UniProtKB">UniProtKB</option>
                  <option value="NCBI_Entrez">NCBI Entrez</option>
                  <option value="User_Upload">User FASTA</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* FASTA Sequence */}
        <section className="soft-card overflow-hidden">
          <div className="px-5 py-4 border-b border-blue-100 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Dna className="w-4 h-4 text-cyan-600" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-ink-900">
                    FASTA Protein Sequence
                  </h3>
                  <p className="text-xs text-ink-500 mt-0.5">
                    IUPAC standard amino-acid sequence input.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleValidate}
                disabled={validating || !fastaContent.trim()}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Run Biopython Validation
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-xl border border-blue-100 bg-[#f8fbff] overflow-hidden">
              <div className="px-3 py-2 border-b border-blue-100 bg-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-ink-600">
                  Sequence editor
                </span>
                <span className="ml-auto text-[10px] text-ink-500 font-mono">
                  FASTA
                </span>
              </div>

              <textarea
                rows={10}
                value={fastaContent}
                onChange={(e) => {
                  setFastaContent(e.target.value);
                  setValidation(null);
                }}
                placeholder=">Accession|Header&#10;MFVFLVLLPLVSSQC..."
                required
                className="w-full p-4 bg-transparent text-xs leading-relaxed font-mono text-ink-800 placeholder:text-ink-500 focus:outline-none resize-y"
              />
            </div>

            <div className="flex items-center gap-2 mt-3 text-[11px] text-ink-500">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              Validate the sequence before execution to check format and
              calculated properties.
            </div>
          </div>
        </section>

        {/* Validation Results */}
        {validation && (
          <section
            className={`rounded-2xl border p-5 ${
              validation.is_valid
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  validation.is_valid
                    ? 'bg-emerald-100'
                    : 'bg-rose-100'
                }`}
              >
                {validation.is_valid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
              </div>

              <div>
                <h3
                  className={`text-sm font-bold ${
                    validation.is_valid
                      ? 'text-emerald-800'
                      : 'text-rose-800'
                  }`}
                >
                  {validation.is_valid
                    ? 'Sequence Conforms to IUPAC Protein Standards'
                    : 'Sequence Validation Failed'}
                </h3>

                <p
                  className={`text-xs mt-0.5 ${
                    validation.is_valid
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  Biopython validation response
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="bg-white/80 border border-emerald-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wide text-ink-500">
                  Length
                </p>
                <p className="font-mono text-sm font-bold text-ink-900 mt-1">
                  {validation.length} aa
                </p>
              </div>

              <div className="bg-white/80 border border-emerald-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wide text-ink-500">
                  Mol. Weight
                </p>
                <p className="font-mono text-sm font-bold text-ink-900 mt-1">
                  {validation.molecular_weight
                    ? `${validation.molecular_weight} Da`
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-white/80 border border-emerald-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wide text-ink-500">
                  Isoelectric Point
                </p>
                <p className="font-mono text-sm font-bold text-ink-900 mt-1">
                  {validation.isoelectric_point ?? 'N/A'}
                </p>
              </div>

              <div className="bg-white/80 border border-emerald-100 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wide text-ink-500">
                  GRAVY Index
                </p>
                <p className="font-mono text-sm font-bold text-ink-900 mt-1">
                  {validation.gravy ?? 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-200/70 text-[11px] font-mono text-ink-600 break-all">
              <span className="font-semibold text-ink-700">
                SHA-256 Hash:
              </span>{' '}
              {validation.sha256_hash}
            </div>

            {validation.warnings.length > 0 && (
              <div className="mt-3 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <span className="font-semibold">Warnings:</span>{' '}
                {validation.warnings.join(' | ')}
              </div>
            )}
          </section>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Pipeline Execution */}
        <section className="soft-card p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-brand-500" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-900">
                  Execute Full Pipeline Workflow
                </h3>

                <p className="text-xs text-ink-500 mt-1 max-w-2xl leading-relaxed">
                  Automatically runs Stages 2–8 including antigenicity,
                  epitopes, safety, assembly, and docking with provenance
                  logging.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={autoRun}
              onClick={() => setAutoRun((value) => !value)}
              className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border transition-colors ${
                autoRun
                  ? 'bg-brand-500 border-brand-500'
                  : 'bg-blue-100 border-blue-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow-sm transition-transform ${
                  autoRun ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-100 flex items-center gap-2 text-[11px] text-ink-500">
            <span
              className={`w-2 h-2 rounded-full ${
                autoRun ? 'bg-emerald-500' : 'bg-ink-500'
              }`}
            />
            {autoRun
              ? 'Full pipeline execution enabled'
              : 'Pipeline execution disabled — analysis will be created without automatic execution'}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 pb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-blue-100 bg-white text-sm font-semibold text-ink-600 hover:bg-blue-50 hover:text-brand-700 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all shadow-blue disabled:opacity-50 disabled:cursor-not-allowed"
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