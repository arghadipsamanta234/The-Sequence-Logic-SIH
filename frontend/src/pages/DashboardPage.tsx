import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Dna,
  ShieldCheck,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { StatusPill } from '../components/common/StatusPill';

export const DashboardPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [runs, benchs] = await Promise.all([
          api.listAnalyses(),
          api.getBenchmarks()
        ]);
        setAnalyses(runs);
        setBenchmarks(benchs);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Prototype • Working Computational Pipeline</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Sequence Logic: Rational Multi-Epitope Vaccine Architecture
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Automating the complete reverse-vaccinology pipeline from antigen sequence ingestion to epitope prediction,
            safety filtering, construct design, structural modeling, receptor docking, and audit-ready research reporting.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <Link
              to="/new-analysis"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch New Analysis</span>
            </Link>
            <Link
              to="/sources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>View Data Sources</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Analyses</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{analyses.length}</p>
          <span className="text-[11px] text-slate-400">Tracked in SQLite database</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Curated Benchmarks</span>
            <Dna className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{benchmarks.length}</p>
          <span className="text-[11px] text-slate-400">Gold-standard reference pathogens</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Pipeline Stages</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">9 / 9</p>
          <span className="text-[11px] text-slate-400">Full end-to-end stages mapped</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Scientific Integrity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">100%</p>
          <span className="text-[11px] text-slate-400">Zero synthetic fabrication policy</span>
        </div>
      </div>

      {/* Quick Launch Gold-Standard Presets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Gold-Standard Benchmark Pathogens</h3>
            <p className="text-xs text-slate-400">Real, peer-reviewed public biological data ready for immediate pipeline analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benchmarks.map((bench) => (
            <div
              key={bench.accession}
              className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {bench.accession}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{bench.sequence.length} aa</span>
                </div>
                <h4 className="font-semibold text-white text-base">{bench.name}</h4>
                <p className="text-xs text-emerald-400/90 font-medium">{bench.organism}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{bench.function_summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">PDB: {bench.pdb_reference || 'Available'}</span>
                <Link
                  to={`/new-analysis?preset=${bench.accession}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  <span>Load Preset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Pipeline Executions</h3>
          <Link to="/new-analysis" className="text-xs font-medium text-emerald-400 hover:underline">
            + Create New
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Analysis Title</th>
                <th className="py-3 px-4 font-semibold">Target Accession</th>
                <th className="py-3 px-4 font-semibold">Progress</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading pipeline records...
                  </td>
                </tr>
              ) : analyses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No pipeline runs found. Launch your first analysis using a benchmark pathogen above!
                  </td>
                </tr>
              ) : (
                analyses.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400">#{run.id}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{run.title}</td>
                    <td className="py-3.5 px-4 text-emerald-400">{run.accession}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(run.current_stage / run.total_stages) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {run.current_stage}/{run.total_stages}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <StatusPill status={run.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 font-sans">
                      <Link
                        to={`/pipeline/${run.id}`}
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        <span>View Pipeline</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
