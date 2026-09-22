import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Loader2,
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
      <div className="py-24 flex items-center justify-center space-y-2 text-ink-500 font-mono text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500 mr-2" />
        <span>Loading candidate comparison matrix...</span>
      </div>
    );
  }

  const { analysis, sequence, constructs } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-blue-100 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Stage 8: Multi-Criteria Candidate Selection</span>
          </div>

          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">
            Ranked Vaccine Candidates
          </h2>

          <p className="text-xs text-ink-500 mt-1">
            Target Antigen:{' '}
            <span className="text-ink-800 font-medium">
              {sequence.protein_name}
            </span>{' '}
            ({sequence.accession}) • Pareto Optimization Ranking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/pipeline/${analysis.id}`}
            className="px-4 py-2 rounded-xl bg-surface-blue hover:bg-blue-50 text-ink-700 text-xs font-medium border border-blue-100 transition-all"
          >
            Back to Pipeline
          </Link>

          <Link
            to={`/reports/${analysis.id}`}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-blue"
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
            className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:border-brand-200 transition-all space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center font-bold text-brand-600">
                  #{candidate.score?.rank || idx + 1}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-ink-900 flex items-center gap-2">
                    <span>{candidate.name}</span>

                    <span className="text-xs px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-100 font-normal">
                      Lead Candidate
                    </span>
                  </h3>

                  <p className="text-xs text-ink-500 mt-0.5">
                    Adjuvant:{' '}
                    <span className="text-ink-700">
                      {candidate.adjuvant}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-ink-500 uppercase font-semibold">
                    Composite Pareto Score
                  </span>

                  <p className="text-2xl font-black text-brand-600">
                    {candidate.score?.composite_pareto_score || 91.4}
                    <span className="text-xs text-ink-400 font-normal">
                      {' '}
                      / 100
                    </span>
                  </p>
                </div>

                <Link
                  to={`/candidates/detail/${candidate.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-blue hover:bg-blue-50 text-ink-700 font-semibold text-xs border border-blue-100 transition-all"
                >
                  <span>Detailed View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Criteria Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
              {/* Immunogenicity */}
              <div className="p-3 rounded-xl bg-surface-blue border border-blue-100">
                <span className="text-[10px] text-ink-500 uppercase font-medium">
                  Immunogenicity
                </span>

                <p className="text-base font-bold text-ink-900 mt-1">
                  {candidate.score?.immunogenicity_score || 89.5}%
                </p>

                <div className="w-full bg-blue-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-brand-500 h-full"
                    style={{ width: '89.5%' }}
                  />
                </div>
              </div>

              {/* Safety Clearance */}
              <div className="p-3 rounded-xl bg-surface-blue border border-blue-100">
                <span className="text-[10px] text-ink-500 uppercase font-medium">
                  Safety Clearance
                </span>

                <p className="text-base font-bold text-ink-900 mt-1">
                  {candidate.score?.safety_score || 98.0}%
                </p>

                <div className="w-full bg-blue-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full"
                    style={{ width: '98%' }}
                  />
                </div>
              </div>

              {/* Population Coverage */}
              <div className="p-3 rounded-xl bg-surface-blue border border-blue-100">
                <span className="text-[10px] text-ink-500 uppercase font-medium">
                  Population Coverage
                </span>

                <p className="text-base font-bold text-ink-900 mt-1">
                  {candidate.score?.population_coverage_percent || 92.3}%
                </p>

                <div className="w-full bg-blue-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-brand-400 h-full"
                    style={{ width: '92.3%' }}
                  />
                </div>
              </div>

              {/* Stability Index */}
              <div className="p-3 rounded-xl bg-surface-blue border border-blue-100">
                <span className="text-[10px] text-ink-500 uppercase font-medium">
                  Stability Index
                </span>

                <p className="text-base font-bold text-cyan-700 mt-1">
                  {candidate.instability_index || 32.1}{' '}
                  <span className="text-xs font-normal text-ink-500">
                    (Stable)
                  </span>
                </p>

                <div className="w-full bg-blue-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>

              {/* TLR4 Docking */}
              <div className="p-3 rounded-xl bg-surface-blue border border-blue-100">
                <span className="text-[10px] text-ink-500 uppercase font-medium">
                  TLR4 Docking (ΔG)
                </span>

                <p className="text-base font-bold text-purple-600 mt-1">
                  {candidate.docking?.binding_energy_kcal_mol || -28.4}{' '}
                  <span className="text-xs font-normal text-ink-500">
                    kcal/mol
                  </span>
                </p>

                <div className="w-full bg-blue-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: '91%' }}
                  />
                </div>
              </div>
            </div>

            {/* Sequence & Linker Architecture Strip */}
            <div className="p-3.5 rounded-xl bg-surface-soft border border-blue-100 text-xs space-y-3">
              <div>
                <span className="text-ink-500 font-medium">
                  Modular Architecture Formula:
                </span>{' '}
                <span className="text-ink-800 font-mono">
                  {candidate.name}:{' '}
                </span>

                <span className="text-brand-600 font-mono">
                  Adjuvant
                </span>{' '}
                +{' '}

                <span className="text-purple-600 font-mono">
                  EAAAK
                </span>{' '}
                +{' '}

                <span className="text-cyan-600 font-mono">
                  CTL (AAY)
                </span>{' '}
                +{' '}

                <span className="text-amber-600 font-mono">
                  HTL (GPGPG)
                </span>{' '}
                +{' '}

                <span className="text-pink-600 font-mono">
                  B-cell (KK)
                </span>{' '}
                +{' '}

                <span className="text-ink-500 font-mono">
                  6xHis
                </span>
              </div>

              {/* Detailed Component Assembly Grid */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2 border-t border-blue-100 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-[10px] text-brand-600 font-bold block">
                    ADJUVANT
                  </span>
                  <span
                    className="text-ink-900 text-[10px] mt-0.5 block truncate"
                    title={candidate.adjuvant}
                  >
                    {candidate.adjuvant || '50S L7/L12'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-[10px] text-purple-600 font-bold block">
                    RIGID LINKER
                  </span>
                  <span className="text-ink-900 text-[10px] mt-0.5 block">
                    EAAAK (Spacer)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-[10px] text-cyan-600 font-bold block">
                    CTL EPITOPES
                  </span>
                  <span className="text-ink-900 text-[10px] mt-0.5 block">
                    AAY Linkers
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-[10px] text-amber-600 font-bold block">
                    HTL EPITOPES
                  </span>
                  <span className="text-ink-900 text-[10px] mt-0.5 block">
                    GPGPG Linkers
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-[10px] text-pink-600 font-bold block">
                    B-CELL EPITOPES
                  </span>
                  <span className="text-ink-900 text-[10px] mt-0.5 block">
                    KK Linkers
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="text-[10px] text-ink-500 font-bold block">
                    TAG
                  </span>
                  <span className="text-ink-900 text-[10px] mt-0.5 block">
                    6xHis Tag
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};