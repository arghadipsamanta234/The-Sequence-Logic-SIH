import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft,
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

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `sequence_logic_report_analysis_${id}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  if (loading || !report) {
    return (
      <div className="py-24 flex items-center justify-center space-y-2 text-ink-500 font-mono text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500 mr-2" />
        <span>
          Compiling scientific dossier & verifying provenance hashes...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-blue-100 shadow-card">
        <div>
          <Link
            to={`/pipeline/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-brand-600 mb-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Pipeline Tracker</span>
          </Link>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />

            <h2 className="text-2xl font-bold text-ink-900 tracking-tight">
              Scientific Research Dossier
            </h2>
          </div>

          <p className="text-xs text-ink-500 mt-1">
            Analysis ID: #{report.analysis_id} • Generated:{' '}
            {new Date(report.timestamp).toUTCString()}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-surface-blue text-ink-700 text-xs font-semibold border border-blue-100 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-blue"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Archive</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Verification Seal */}
      <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />

          <div>
            <span className="text-xs font-semibold text-brand-800 block">
              Cryptographic Verification Checksum
            </span>

            <span className="text-[11px] font-mono text-brand-600 break-all">
              {report.report_checksum_sha256}
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card space-y-4">
        <h3 className="text-base font-bold text-ink-900">
          1. Executive Research Summary
        </h3>

        <p className="text-xs text-ink-700 leading-relaxed">
          This dossier records the automated reverse-vaccinology design
          pipeline for target antigen{' '}
          <strong className="text-ink-900">{report.protein}</strong> from{' '}
          <strong className="text-ink-900">{report.organism}</strong>{' '}
          (Accession: {report.accession}). Candidate constructs were assembled
          using validated immunological linkers and evaluated for
          physicochemical stability, immunogenic epitope density, population
          coverage, and immune receptor docking.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-lg bg-surface-blue border border-blue-100">
            <span className="text-ink-500 block text-[11px]">
              Primary Accession
            </span>

            <span className="text-brand-600 font-mono font-bold mt-1 block">
              {report.accession}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-blue border border-blue-100">
            <span className="text-ink-500 block text-[11px]">
              Candidates Designed
            </span>

            <span className="text-ink-900 font-mono font-bold mt-1 block">
              {report.candidates.length} Constructs
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-blue border border-blue-100">
            <span className="text-ink-500 block text-[11px]">
              Input Sequence Hash
            </span>

            <span
              className="text-ink-700 font-mono text-[10px] truncate mt-1 block"
              title={report.sequence_hash}
            >
              {report.sequence_hash.substring(0, 16)}...
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-blue border border-blue-100">
            <span className="text-ink-500 block text-[11px]">
              Integrity Status
            </span>

            <span className="text-brand-600 font-bold mt-1 block">
              Full Provenance Logged
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Summary Table */}
      <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card space-y-4">
        <h3 className="text-base font-bold text-ink-900">
          2. Lead Vaccine Constructs
        </h3>

        <div className="overflow-x-auto rounded-xl border border-blue-100 bg-surface-blue">
          <table className="w-full text-left text-xs text-ink-700">
            <thead className="bg-blue-50 text-[11px] uppercase text-ink-600 border-b border-blue-100">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Rank</th>
                <th className="py-2.5 px-3 font-semibold">
                  Construct Name
                </th>
                <th className="py-2.5 px-3 font-semibold">Length</th>
                <th className="py-2.5 px-3 font-semibold">Mol. Weight</th>
                <th className="py-2.5 px-3 font-semibold">pI</th>
                <th className="py-2.5 px-3 font-semibold">
                  Instability Index
                </th>
                <th className="py-2.5 px-3 font-semibold">MCDA Score</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-100/80 font-mono text-xs">
              {report.candidates.map((c: any) => (
                <tr
                  key={c.name}
                  className="hover:bg-white transition-colors"
                >
                  <td className="py-2.5 px-3 text-brand-600 font-bold">
                    #{c.rank}
                  </td>

                  <td className="py-2.5 px-3 font-sans font-medium text-ink-900">
                    {c.name}
                  </td>

                  <td className="py-2.5 px-3">{c.length} aa</td>

                  <td className="py-2.5 px-3">
                    {c.mw_da ? `${c.mw_da} Da` : 'N/A'}
                  </td>

                  <td className="py-2.5 px-3">{c.pi ?? 'N/A'}</td>

                  <td className="py-2.5 px-3 text-brand-600">
                    {c.instability ?? 'N/A'}
                  </td>

                  <td className="py-2.5 px-3 text-brand-600 font-bold">
                    {c.composite_score} / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bio-chemist View: Full Construct Sequence Box */}
        <div className="mt-4 pt-4 border-t border-blue-100 space-y-3">
          <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            🧬 Lead Construct Full Amino Acid Sequence (FASTA)
          </h4>

          {report.candidates.map((c: any) => (
            <div key={`seq-${c.name}`} className="space-y-1.5">
              <div className="text-[11px] text-ink-500 font-medium">
                {c.name} Complete Construct Sequence:
              </div>

              <div className="p-3 rounded-lg bg-surface-blue border border-blue-100 font-mono text-[11px] text-brand-700 break-all max-h-32 overflow-y-auto selection:bg-brand-200 selection:text-ink-900">
                {c.full_sequence ||
                  c.sequence ||
                  'কনস্ট্রাক্ট সিকোয়েন্স লোড হচ্ছে...'}
              </div>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    c.full_sequence || c.sequence || '',
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-surface-blue text-ink-700 text-[11px] font-semibold transition-all border border-blue-100"
              >
                Copy Sequence for Wet-lab
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Scientific Provenance Audit Table */}
      <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card space-y-4">
        <h3 className="text-base font-bold text-ink-900">
          3. Immutable Provenance Audit Trail
        </h3>

        <p className="text-xs text-ink-500">
          Every computational calculation, external API invocation, fallback
          method, and execution timestamp:
        </p>

        <div className="overflow-x-auto rounded-xl border border-blue-100 bg-surface-blue">
          <table className="w-full text-left text-xs text-ink-700">
            <thead className="bg-blue-50 text-[10px] uppercase text-ink-600 border-b border-blue-100">
              <tr>
                <th className="py-2 px-3 font-semibold">Stage</th>
                <th className="py-2 px-3 font-semibold">
                  Tool & Version
                </th>
                <th className="py-2 px-3 font-semibold">
                  Execution Method
                </th>
                <th className="py-2 px-3 font-semibold">Method Type</th>
                <th className="py-2 px-3 font-semibold">
                  Timestamp (UTC)
                </th>
                <th className="py-2 px-3 font-semibold">
                  Notes / Disclaimer
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-100/80 font-mono text-[11px]">
              {report.provenance_audit_log.map(
                (log: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-white transition-colors"
                  >
                    <td className="py-2 px-3 font-sans font-medium text-ink-900">
                      {log.stage}
                    </td>

                    <td className="py-2 px-3 text-brand-600">
                      {log.tool} {log.version}
                    </td>

                    <td className="py-2 px-3 text-ink-700">
                      {log.method}
                    </td>

                    <td className="py-2 px-3 text-ink-500">
                      {log.method_type}
                    </td>

                    <td className="py-2 px-3 text-ink-500 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-2 px-3 font-sans text-ink-700 max-w-xs">
                      {log.notes}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer */}
      <div className="p-4 rounded-xl bg-surface-blue border border-blue-100 text-xs text-ink-600 space-y-1">
        <span className="font-semibold text-ink-800 block">
          Notice of Scientific Integrity & Regulatory Compliance:
        </span>

        <p className="leading-relaxed">{report.disclaimer}</p>
      </div>
    </div>
  );
};