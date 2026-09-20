import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft
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
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sequence_logic_report_analysis_${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !report) {
    return (
      <div className="py-24 flex items-center justify-center space-y-2 text-slate-400 font-mono text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
        <span>Compiling scientific dossier & verifying provenance hashes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <Link
            to={`/pipeline/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Pipeline Tracker</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Scientific Research Dossier</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analysis ID: #{report.analysis_id} • Generated: {new Date(report.timestamp).toUTCString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Archive</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Verification Seal */}
      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-emerald-300 block">Cryptographic Verification Checksum</span>
            <span className="text-[11px] font-mono text-emerald-400/80 break-all">{report.report_checksum_sha256}</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">1. Executive Research Summary</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          This dossier records the automated reverse-vaccinology design pipeline for target antigen{' '}
          <strong className="text-white">{report.protein}</strong> from{' '}
          <strong className="text-white">{report.organism}</strong> (Accession: {report.accession}).
          Candidate constructs were assembled using validated immunological linkers and evaluated for physicochemical stability,
          immunogenic epitope density, population coverage, and immune receptor docking.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Primary Accession</span>
            <span className="text-emerald-400 font-mono font-bold mt-1 block">{report.accession}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Candidates Designed</span>
            <span className="text-white font-mono font-bold mt-1 block">{report.candidates.length} Constructs</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Input Sequence Hash</span>
            <span className="text-slate-300 font-mono text-[10px] truncate mt-1 block" title={report.sequence_hash}>
              {report.sequence_hash.substring(0, 16)}...
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Integrity Status</span>
            <span className="text-emerald-400 font-bold mt-1 block">Full Provenance Logged</span>
          </div>
        </div>
      </div>

      {/* Candidate Summary Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">2. Lead Vaccine Constructs</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Rank</th>
                <th className="py-2.5 px-3 font-semibold">Construct Name</th>
                <th className="py-2.5 px-3 font-semibold">Length</th>
                <th className="py-2.5 px-3 font-semibold">Mol. Weight</th>
                <th className="py-2.5 px-3 font-semibold">pI</th>
                <th className="py-2.5 px-3 font-semibold">Instability Index</th>
                <th className="py-2.5 px-3 font-semibold">MCDA Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {report.candidates.map((c: any) => (
                <tr key={c.name}>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">#{c.rank}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{c.name}</td>
                  <td className="py-2.5 px-3">{c.length} aa</td>
                  <td className="py-2.5 px-3">{c.mw_da ? `${c.mw_da} Da` : 'N/A'}</td>
                  <td className="py-2.5 px-3">{c.pi ?? 'N/A'}</td>
                  <td className="py-2.5 px-3 text-emerald-300">{c.instability ?? 'N/A'}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{c.composite_score} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Scientific Provenance Audit Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">3. Immutable Provenance Audit Trail</h3>
        <p className="text-xs text-slate-400">
          Every computational calculation, external API invocation, fallback method, and execution timestamp:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[10px] uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3 font-semibold">Stage</th>
                <th className="py-2 px-3 font-semibold">Tool & Version</th>
                <th className="py-2 px-3 font-semibold">Execution Method</th>
                <th className="py-2 px-3 font-semibold">Method Type</th>
                <th className="py-2 px-3 font-semibold">Timestamp (UTC)</th>
                <th className="py-2 px-3 font-semibold">Notes / Disclaimer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {report.provenance_audit_log.map((log: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2 px-3 font-sans font-medium text-white">{log.stage}</td>
                  <td className="py-2 px-3 text-emerald-400">
                    {log.tool} {log.version}
                  </td>
                  <td className="py-2 px-3 text-slate-300">{log.method}</td>
                  <td className="py-2 px-3 text-slate-400">{log.method_type}</td>
                  <td className="py-2 px-3 text-slate-400 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-300 max-w-xs">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1">
        <span className="font-semibold text-slate-300 block">Notice of Scientific Integrity & Regulatory Compliance:</span>
        <p className="leading-relaxed">{report.disclaimer}</p>
      </div>
    </div>
  );
};
