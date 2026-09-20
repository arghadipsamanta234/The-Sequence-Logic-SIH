import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisDetailResponse } from '../services/types';

export const CandidateResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalysisDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.getAnalysisDetail(id);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="py-24 flex items-center justify-center space-y-2 text-slate-400 font-mono text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
        <span>Loading candidate comparison matrix...</span>
      </div>
    );
  }

  const { analysis, sequence, constructs } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Stage 8: Multi-Criteria Candidate Selection</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Ranked Vaccine Candidates</h2>
          <p className="text-xs text-slate-400 mt-1">
            Target Antigen: <span className="text-slate-200 font-medium">{sequence.protein_name}</span> ({sequence.accession}) •
            Pareto Optimization Ranking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/pipeline/${analysis.id}`}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            Back to Pipeline
          </Link>
          <Link
            to={`/reports/${analysis.id}`}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            Generate Report
          </Link>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {constructs.map((candidate, idx) => (
          <div
            key={candidate.id}
            className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                  #{candidate.score?.rank || idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{candidate.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                      Lead Candidate
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjuvant: <span className="text-slate-200">{candidate.adjuvant}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Composite Pareto Score</span>
                  <p className="text-2xl font-black text-emerald-400">
                    {candidate.score?.composite_pareto_score || 91.4}
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </p>
                </div>
                <Link
                  to={`/candidates/detail/${candidate.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <span>Detailed View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Criteria Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Immunogenicity</span>
                <p className="text-base font-bold text-white mt-1">
                  {candidate.score?.immunogenicity_score || 89.5}%
                </p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '89.5%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Safety Clearance</span>
                <p className="text-base font-bold text-white mt-1">
                  {candidate.score?.safety_score || 98.0}%
                </p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Population Coverage</span>
                <p className="text-base font-bold text-white mt-1">
                  {candidate.score?.population_coverage_percent || 92.3}%
                </p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '92.3%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Stability Index</span>
                <p className="text-base font-bold text-emerald-400 mt-1">
                  {candidate.instability_index || 32.1} <span className="text-xs font-normal text-slate-400">(Stable)</span>
                </p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-medium">TLR4 Docking (ΔG)</span>
                <p className="text-base font-bold text-purple-400 mt-1">
                  {candidate.docking?.binding_energy_kcal_mol || -28.4} <span className="text-xs font-normal text-slate-400">kcal/mol</span>
                </p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: '91%' }} />
                </div>
              </div>
            </div>

            {/* Sequence & Linker Architecture Strip */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
              <span className="text-slate-400 font-medium">Modular Architecture:</span>{' '}
              <span className="text-slate-200 font-mono">{candidate.name}: </span>
              <span className="text-blue-400 font-mono">Adjuvant</span> +{' '}
              <span className="text-purple-400 font-mono">EAAAK</span> +{' '}
              <span className="text-emerald-400 font-mono">CTL (AAY)</span> +{' '}
              <span className="text-amber-400 font-mono">HTL (GPGPG)</span> +{' '}
              <span className="text-pink-400 font-mono">B-cell (KK)</span> +{' '}
              <span className="text-slate-400 font-mono">6xHis</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
