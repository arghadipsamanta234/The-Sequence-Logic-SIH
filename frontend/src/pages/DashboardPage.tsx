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
  Clock,
  Activity,
  FlaskConical,
  ChevronRight,
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
          api.getBenchmarks(),
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

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 sm:p-8 lg:p-10 shadow-card">

        {/* Decorative background */}
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative z-10 max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">

            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />

            <span>SIH 2026 Prototype</span>

            <span className="h-1 w-1 rounded-full bg-cyan-500" />

            <span className="text-cyan-600">
              Computational Pipeline
            </span>

          </div>

          {/* Heading */}
          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">

            Rational Multi-Epitope

            <span className="block bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 bg-clip-text text-transparent">
              Vaccine Architecture
            </span>

          </h2>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-sm leading-7 text-ink-600 sm:text-base">

            Automating the reverse-vaccinology workflow from antigen sequence
            ingestion through epitope prediction, safety filtering, construct
            design, structural analysis, receptor docking, and research
            reporting.

          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">

            <Link
              to="/new-analysis"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-blue transition-all hover:bg-brand-600"
            >
              <PlusCircle className="h-4 w-4" />

              Launch New Analysis

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/sources"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-all hover:bg-blue-50"
            >
              <Database className="h-4 w-4 text-brand-500" />

              View Data Sources
            </Link>

          </div>

        </div>

        {/* DNA decoration */}
        <div className="absolute right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 items-center justify-center xl:flex">

          <div className="absolute inset-8 rounded-full border border-blue-200/60" />

          <div className="absolute inset-14 rounded-full border border-cyan-200/70" />

          <div className="flex h-28 w-28 rotate-12 items-center justify-center rounded-3xl border border-cyan-200 bg-white/70 shadow-soft backdrop-blur">

            <Dna className="-rotate-12 h-14 w-14 text-cyan-500" />

          </div>

          <div className="absolute right-8 top-8 h-3 w-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-300/50" />

          <div className="absolute bottom-12 left-8 h-2 w-2 rounded-full bg-blue-400" />

          <div className="absolute right-0 top-1/2 h-2 w-2 rounded-full bg-brand-400" />

        </div>

      </section>


      {/* =========================================================
          STATISTICS
      ========================================================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Analyses */}
        <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all hover:border-brand-200 hover:shadow-soft">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Total Analyses
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
              <Layers className="h-4 w-4 text-brand-500" />
            </div>

          </div>

          <p className="mt-4 text-3xl font-bold text-ink-900">
            {analyses.length}
          </p>

          <span className="text-[11px] text-ink-500">
            Tracked in SQLite database
          </span>

        </div>


        {/* Curated Benchmarks */}
        <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all hover:border-cyan-200 hover:shadow-soft">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Curated Benchmarks
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50">
              <Dna className="h-4 w-4 text-cyan-500" />
            </div>

          </div>

          <p className="mt-4 text-3xl font-bold text-ink-900">
            {benchmarks.length}
          </p>

          <span className="text-[11px] text-ink-500">
            Gold-standard reference pathogens
          </span>

        </div>


        {/* Pipeline Stages */}
        <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all hover:border-brand-200 hover:shadow-soft">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Active Pipeline Stages
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Clock className="h-4 w-4 text-brand-500" />
            </div>

          </div>

          <p className="mt-4 text-3xl font-bold text-ink-900">
            9 / 9
          </p>

          <span className="text-[11px] text-ink-500">
            Full end-to-end stages mapped
          </span>

        </div>


        {/* Scientific Integrity */}
        <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all hover:border-emerald-200 hover:shadow-soft">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Scientific Integrity
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>

          </div>

          <p className="mt-4 text-3xl font-bold text-emerald-500">
            100%
          </p>

          <span className="text-[11px] text-ink-500">
            Zero synthetic fabrication policy
          </span>

        </div>

      </section>


      {/* =========================================================
          BENCHMARK PATHOGENS
      ========================================================= */}

      <section className="space-y-4">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2">

              <FlaskConical className="h-5 w-5 text-brand-500" />

              <h3 className="text-lg font-bold text-ink-900">
                Gold-Standard Benchmark Pathogens
              </h3>

            </div>

            <p className="mt-1 text-xs text-ink-500">
              Real, peer-reviewed public biological data ready for immediate
              pipeline analysis.
            </p>

          </div>

          <span className="text-[10px] uppercase tracking-wider text-ink-500">
            {benchmarks.length} references
          </span>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {benchmarks.map((bench) => (

            <div
              key={bench.accession}
              className="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all hover:border-brand-200 hover:shadow-soft"
            >

              <div>

                <div className="mb-4 flex items-center justify-between">

                  <span className="rounded-md border border-blue-100 bg-brand-50 px-2 py-1 font-mono text-[11px] text-brand-700">
                    {bench.accession}
                  </span>

                  <span className="font-mono text-[11px] text-ink-500">
                    {bench.sequence.length} aa
                  </span>

                </div>

                <h4 className="text-base font-semibold text-ink-900">
                  {bench.name}
                </h4>

                <p className="mt-1 text-xs font-medium text-cyan-600">
                  {bench.organism}
                </p>

                <p className="mt-3 line-clamp-3 text-xs leading-5 text-ink-500">
                  {bench.function_summary}
                </p>

              </div>


              <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-4">

                <span className="text-[10px] text-ink-500">
                  PDB: {bench.pdb_reference || 'Available'}
                </span>

                <Link
                  to={`/new-analysis?preset=${bench.accession}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 transition-colors hover:text-brand-700"
                >
                  Load Preset

                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />

                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =========================================================
          RECENT PIPELINE EXECUTIONS
      ========================================================= */}

      <section className="space-y-4">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Activity className="h-5 w-5 text-brand-500" />

              <h3 className="text-lg font-bold text-ink-900">
                Recent Pipeline Executions
              </h3>

            </div>

            <p className="mt-1 text-xs text-ink-500">
              Monitor recently submitted analysis workflows.
            </p>

          </div>

          <Link
            to="/new-analysis"
            className="hidden items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-700 sm:inline-flex"
          >
            Create New

            <ChevronRight className="h-3.5 w-3.5" />

          </Link>

        </div>


        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-card">

          <table className="w-full text-left text-sm text-ink-700">

            <thead className="border-b border-blue-100 bg-blue-50 text-[10px] uppercase tracking-wider text-ink-500">

              <tr>

                <th className="px-4 py-3.5 font-semibold">
                  ID
                </th>

                <th className="px-4 py-3.5 font-semibold">
                  Analysis Title
                </th>

                <th className="px-4 py-3.5 font-semibold">
                  Target Accession
                </th>

                <th className="px-4 py-3.5 font-semibold">
                  Progress
                </th>

                <th className="px-4 py-3.5 font-semibold">
                  Status
                </th>

                <th className="px-4 py-3.5 text-right font-semibold">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-blue-50 font-mono text-xs">

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-12 text-center text-ink-500"
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Activity className="h-4 w-4 animate-pulse text-brand-500" />

                      Loading pipeline records...

                    </div>

                  </td>

                </tr>

              ) : analyses.length === 0 ? (

                <tr>

                  <td colSpan={6} className="py-12 text-center">

                    <div className="flex flex-col items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                        <Database className="h-5 w-5 text-ink-500" />

                      </div>

                      <div>

                        <p className="text-sm text-ink-700">
                          No pipeline runs found
                        </p>

                        <p className="mt-1 text-xs text-ink-500">
                          Launch your first analysis using a benchmark
                          pathogen above.
                        </p>

                      </div>

                    </div>

                  </td>

                </tr>

              ) : (

                analyses.map((run) => (

                  <tr
                    key={run.id}
                    className="transition-colors hover:bg-blue-50/60"
                  >

                    <td className="px-4 py-3.5 text-ink-500">
                      #{run.id}
                    </td>

                    <td className="px-4 py-3.5 font-sans font-medium text-ink-900">
                      {run.title}
                    </td>

                    <td className="px-4 py-3.5 text-brand-600">
                      {run.accession}
                    </td>

                    <td className="px-4 py-3.5">

                      <div className="flex items-center gap-2">

                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-blue-100">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"
                            style={{
                              width: `${
                                (run.current_stage / run.total_stages) * 100
                              }%`,
                            }}
                          />

                        </div>

                        <span className="text-[11px] text-ink-500">
                          {run.current_stage}/{run.total_stages}
                        </span>

                      </div>

                    </td>

                    <td className="px-4 py-3.5 font-sans">
                      <StatusPill status={run.status} />
                    </td>

                    <td className="px-4 py-3.5 text-right font-sans">

                      <Link
                        to={`/pipeline/${run.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-700"
                      >
                        View Pipeline

                        <ArrowRight className="h-3 w-3" />

                      </Link>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
};
