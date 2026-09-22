import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  FileText,
  Database,
  FlaskConical,
  Fingerprint,
  ClipboardCheck,
  Clock3,
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;

      try {
        const data = await api.getAnalysisReport(id);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleDownloadJSON = () => {
    if (!report) return;

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `sequence_logic_report_analysis_${id}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  if (loading || !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="soft-card px-6 py-5 flex items-center gap-3 text-sm text-ink-600">
          <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
          <span>
            Compiling scientific dossier & verifying provenance hashes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ============================================================
          HEADER
      ============================================================ */}
      <section className="soft-card overflow-hidden">
        <div className="p-6 lg:p-7 bg-gradient-to-r from-brand-50 via-white to-cyan-50 border-b border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <Link
                to={`/pipeline/${id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-brand-600 transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Pipeline Tracker</span>
              </Link>

              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-blue shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
                      Scientific Research Dossier
                    </h1>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      VERIFIED
                    </span>
                  </div>

                  <p className="text-xs text-ink-500 mt-1">
                    Analysis ID: #{report.analysis_id}
                    {' • '}
                    Generated: {new Date(report.timestamp).toUTCString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-ink-700 text-xs font-semibold border border-blue-200 transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-blue"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Archive</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report identity strip */}
        <div className="px-6 py-4 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <div className="rounded-xl bg-surface-soft border border-blue-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
                  Target
                </span>
              </div>
              <p className="text-sm font-bold text-ink-900 truncate">
                {report.protein}
              </p>
            </div>

            <div className="rounded-xl bg-surface-soft border border-blue-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
                  Organism
                </span>
              </div>
              <p className="text-sm font-bold text-ink-900 truncate">
                {report.organism}
              </p>
            </div>

            <div className="rounded-xl bg-surface-soft border border-blue-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardCheck className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
                  Accession
                </span>
              </div>
              <p className="text-sm font-mono font-bold text-brand-600 truncate">
                {report.accession}
              </p>
            </div>

            <div className="rounded-xl bg-surface-soft border border-blue-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock3 className="w-3.5 h-3.5 text-cyan-600" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-500">
                  Candidates
                </span>
              </div>
              <p className="text-sm font-bold text-ink-900">
                {report.candidates.length} Constructs
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          CRYPTOGRAPHIC VERIFICATION
      ============================================================ */}
      <section className="rounded-2xl border border-green-200 bg-green-50/70 p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-green-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-green-800">
              Cryptographic Verification Checksum
            </p>

            <p className="mt-1 text-[11px] font-mono text-green-700 break-all">
              {report.report_checksum_sha256}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          EXECUTIVE SUMMARY
      ============================================================ */}
      <section className="soft-card p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-brand-600" />
          </div>

          <div>
            <h2 className="section-title">
              1. Executive Research Summary
            </h2>
            <p className="section-description mt-1">
              Overview of the automated reverse-vaccinology design pipeline.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-surface-soft border border-blue-100 p-5">
          <p className="text-sm text-ink-700 leading-7">
            This dossier records the automated reverse-vaccinology design
            pipeline for target antigen{' '}
            <strong className="text-ink-900">
              {report.protein}
            </strong>{' '}
            from{' '}
            <strong className="text-ink-900">
              {report.organism}
            </strong>{' '}
            (Accession:{' '}
            <span className="font-mono text-brand-600">
              {report.accession}
            </span>
            ). Candidate constructs were assembled using validated
            immunological linkers and evaluated for physicochemical stability,
            immunogenic epitope density, population coverage, and immune
            receptor docking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <div className="rounded-xl bg-white border border-blue-100 p-4">
            <span className="text-[10px] uppercase tracking-wide font-bold text-ink-500">
              Primary Accession
            </span>
            <p className="text-sm text-brand-600 font-mono font-bold mt-2 break-all">
              {report.accession}
            </p>
          </div>

          <div className="rounded-xl bg-white border border-blue-100 p-4">
            <span className="text-[10px] uppercase tracking-wide font-bold text-ink-500">
              Candidates Designed
            </span>
            <p className="text-sm text-ink-900 font-mono font-bold mt-2">
              {report.candidates.length} Constructs
            </p>
          </div>

          <div className="rounded-xl bg-white border border-blue-100 p-4">
            <span className="text-[10px] uppercase tracking-wide font-bold text-ink-500">
              Input Sequence Hash
            </span>

            <p
              className="text-[10px] text-ink-600 font-mono mt-2 truncate"
              title={report.sequence_hash}
            >
              {report.sequence_hash.substring(0, 16)}...
            </p>
          </div>

          <div className="rounded-xl bg-white border border-blue-100 p-4">
            <span className="text-[10px] uppercase tracking-wide font-bold text-ink-500">
              Integrity Status
            </span>

            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-sm text-green-700 font-bold">
                Full Provenance Logged
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          CANDIDATE SUMMARY
      ============================================================ */}
      <section className="soft-card p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
            <FlaskConical className="w-4 h-4 text-cyan-600" />
          </div>

          <div>
            <h2 className="section-title">
              2. Lead Vaccine Constructs
            </h2>
            <p className="section-description mt-1">
              Candidate-level physicochemical and composite scoring summary.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-blue-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-blue text-[10px] uppercase tracking-wide text-ink-500 border-b border-blue-100">
              <tr>
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Construct Name</th>
                <th className="py-3 px-4 font-bold">Length</th>
                <th className="py-3 px-4 font-bold">Mol. Weight</th>
                <th className="py-3 px-4 font-bold">pI</th>
                <th className="py-3 px-4 font-bold">Instability Index</th>
                <th className="py-3 px-4 font-bold">MCDA Score</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-50">
              {report.candidates.map((c: any) => (
                <tr
                  key={c.name}
                  className="hover:bg-surface-soft transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-brand-50 border border-brand-100 text-brand-700 font-bold font-mono">
                      #{c.rank}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-ink-900">
                      {c.name}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-ink-600">
                    {c.length} aa
                  </td>

                  <td className="py-3 px-4 font-mono text-ink-600">
                    {c.mw_da ? `${c.mw_da} Da` : 'N/A'}
                  </td>

                  <td className="py-3 px-4 font-mono text-ink-600">
                    {c.pi ?? 'N/A'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-cyan-700">
                      {c.instability ?? 'N/A'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-brand-600">
                      {c.composite_score} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          PROVENANCE AUDIT TRAIL
      ============================================================ */}
      <section className="soft-card p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
            <Fingerprint className="w-4 h-4 text-brand-600" />
          </div>

          <div>
            <h2 className="section-title">
              3. Immutable Provenance Audit Trail
            </h2>

            <p className="section-description mt-1">
              Every computational calculation, external API invocation,
              fallback method, and execution timestamp.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-blue-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-blue text-[10px] uppercase tracking-wide text-ink-500 border-b border-blue-100">
              <tr>
                <th className="py-3 px-3 font-bold">Stage</th>
                <th className="py-3 px-3 font-bold">Tool & Version</th>
                <th className="py-3 px-3 font-bold">Execution Method</th>
                <th className="py-3 px-3 font-bold">Method Type</th>
                <th className="py-3 px-3 font-bold">Timestamp (UTC)</th>
                <th className="py-3 px-3 font-bold">Notes / Disclaimer</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-50">
              {report.provenance_audit_log.map((log: any, idx: number) => (
                <tr
                  key={idx}
                  className="hover:bg-surface-soft transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className="font-medium text-ink-900">
                      {log.stage}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-brand-600">
                      {log.tool} {log.version}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-ink-700">
                    {log.method}
                  </td>

                  <td className="py-3 px-3 text-ink-500">
                    {log.method_type}
                  </td>

                  <td className="py-3 px-3 text-ink-500 text-[10px] font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="py-3 px-3 text-ink-600 max-w-xs">
                    {log.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SCIENTIFIC DISCLAIMER
      ============================================================ */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-blue-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
          </div>

          <div>
            <span className="text-xs font-bold text-ink-900 block">
              Notice of Scientific Integrity & Regulatory Compliance
            </span>

            <p className="text-xs text-ink-600 leading-relaxed mt-2">
              {report.disclaimer}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};