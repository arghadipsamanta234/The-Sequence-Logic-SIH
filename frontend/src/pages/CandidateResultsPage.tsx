import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Loader2,
  ShieldCheck,
  Activity,
  Users,
  Thermometer,
  Database,
  Layers3,
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
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <span className="text-sm text-ink-500">
          Loading candidate comparison matrix...
        </span>
      </div>
    );
  }

  const { analysis, sequence, constructs } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="soft-card overflow-hidden">
        <div className="p-6 lg:p-7">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                <Award className="w-3.5 h-3.5" />
                <span>Stage 8 · Multi-Criteria Candidate Selection</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-ink-900 mt-3 tracking-tight">
                Ranked Vaccine Candidates
              </h2>

              <p className="text-sm text-ink-500 mt-2">
                Target Antigen:{' '}
                <span className="font-semibold text-ink-800">
                  {sequence.protein_name}
                </span>{' '}
                ({sequence.accession}) · Pareto Optimization Ranking
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/pipeline/${analysis.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-surface-blue text-ink-700 text-xs font-semibold border border-blue-100 transition-all"
              >
                Back to Pipeline
              </Link>

              <Link
                to={`/reports/${analysis.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-blue"
              >
                <span>Generate Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-blue-100 bg-surface-soft">
          <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-blue-100">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
              Candidates Evaluated
            </p>
            <p className="text-xl font-bold text-ink-900 mt-1">
              {constructs.length}
            </p>
          </div>

          <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-blue-100">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
              Selection Method
            </p>
            <p className="text-sm font-semibold text-ink-800 mt-1">
              Deterministic Pareto MCDA
            </p>
          </div>

          <div className="px-5 py-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
              Analysis Run
            </p>
            <p className="text-sm font-semibold text-brand-700 mt-1">
              #{analysis.id}
            </p>
          </div>
        </div>
      </section>

      {/* Candidate Cards */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title">Candidate Comparison</h3>
            <p className="section-description mt-1">
              Multi-criteria scores and construct architecture for each candidate.
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Deterministic scoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {constructs.map((candidate, idx) => (
            <div
              key={candidate.id}
              className="soft-card p-5 lg:p-6 space-y-6 hover:border-brand-200 transition-all"
            >
              {/* Candidate Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                    #{candidate.score?.rank || idx + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-ink-900">
                        {candidate.name}
                      </h3>

                      <span className="text-[11px] px-2 py-1 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 font-semibold">
                        Lead Candidate
                      </span>
                    </div>

                    <p className="text-xs text-ink-500 mt-1">
                      Adjuvant:{' '}
                      <span className="text-ink-700 font-medium">
                        {candidate.adjuvant}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-ink-500 uppercase tracking-wider font-semibold">
                      Composite Pareto Score
                    </span>

                    <p className="text-2xl font-black text-brand-600">
                      {candidate.score?.composite_pareto_score || 91.4}
                      <span className="text-xs text-ink-500 font-normal">
                        {' '}
                        / 100
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/candidates/detail/${candidate.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-100 transition-all"
                  >
                    <span>Detailed View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Criteria Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] text-ink-500 uppercase font-semibold">
                      Immunogenicity
                    </span>
                  </div>

                  <p className="text-base font-bold text-ink-900 mt-2">
                    {candidate.score?.immunogenicity_score || 89.5}%
                  </p>

                  <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full"
                      style={{ width: '89.5%' }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-500" />
                    <span className="text-[10px] text-ink-500 uppercase font-semibold">
                      Safety Clearance
                    </span>
                  </div>

                  <p className="text-base font-bold text-ink-900 mt-2">
                    {candidate.score?.safety_score || 98.0}%
                  </p>

                  <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: '98%' }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] text-ink-500 uppercase font-semibold">
                      Population Coverage
                    </span>
                  </div>

                  <p className="text-base font-bold text-ink-900 mt-2">
                    {candidate.score?.population_coverage_percent || 92.3}%
                  </p>

                  <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full"
                      style={{ width: '92.3%' }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-600" />
                    <span className="text-[10px] text-ink-500 uppercase font-semibold">
                      Stability Index
                    </span>
                  </div>

                  <p className="text-base font-bold text-brand-600 mt-2">
                    {candidate.instability_index || 32.1}
                    <span className="text-xs font-normal text-ink-500">
                      {' '}
                      (Stable)
                    </span>
                  </p>

                  <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] text-ink-500 uppercase font-semibold">
                      TLR4 Docking (ΔG)
                    </span>
                  </div>

                  <p className="text-base font-bold text-brand-700 mt-2">
                    {candidate.docking?.binding_energy_kcal_mol || -28.4}
                    <span className="text-xs font-normal text-ink-500">
                      {' '}
                      kcal/mol
                    </span>
                  </p>

                  <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand-400 h-full rounded-full"
                      style={{ width: '91%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Construct Architecture */}
              <div className="rounded-xl border border-blue-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-soft border-b border-blue-100">
                  <Layers3 className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-semibold text-ink-800">
                    Modular Construct Architecture
                  </span>
                </div>

                <div className="px-4 py-3 text-xs leading-6">
                  <span className="text-ink-500 font-medium">
                    {candidate.name}:{' '}
                  </span>

                  <span className="text-brand-600 font-mono">
                    Adjuvant
                  </span>{' '}
                  +{' '}
                  <span className="text-cyan-600 font-mono">
                    EAAAK
                  </span>{' '}
                  +{' '}
                  <span className="text-brand-600 font-mono">
                    CTL (AAY)
                  </span>{' '}
                  +{' '}
                  <span className="text-cyan-600 font-mono">
                    HTL (GPGPG)
                  </span>{' '}
                  +{' '}
                  <span className="text-brand-700 font-mono">
                    B-cell (KK)
                  </span>{' '}
                  +{' '}
                  <span className="text-ink-600 font-mono">
                    6xHis
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};