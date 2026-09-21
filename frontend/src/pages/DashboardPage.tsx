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

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 sm:p-8 lg:p-10 shadow-card">

        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Prototype</span>

            <span className="w-1 h-1 rounded-full bg-brand-500" />

            <span className="text-brand-500">
              Computational Pipeline
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-ink-900">
            Rational Multi-Epitope

            <span className="block bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 bg-clip-text text-transparent">
              Vaccine Architecture
            </span>
          </h2>

          <p className="mt-5 max-w-3xl text-sm sm:text-base leading-7 text-ink-600">
            Automating the reverse-vaccinology workflow from antigen sequence
            ingestion through epitope prediction, safety filtering, construct
            design, structural analysis, receptor docking, and research
            reporting.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            <Link
              to="/new-analysis"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all shadow-blue"
            >
              <PlusCircle className="w-4 h-4" />
              Launch New Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/sources"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-blue-50 text-brand-700 font-medium text-sm border border-blue-100 transition-all"
            >
              <Database className="w-4 h-4 text-brand-500" />
              View Data Sources
            </Link>

          </div>
        </div>

        {/* Scientific visual */}
        <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 items-center justify-center">

          <div className="absolute inset-8 rounded-full border border-brand-200" />
          <div className="absolute inset-14 rounded-full border border-cyan-200" />

          <div className="w-28 h-28 rounded-3xl bg-white border border-blue-100 flex items-center justify-center rotate-12 shadow-blue">
            <Dna className="w-14 h-14 text-brand-500 -rotate-12" />
          </div>

          <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-brand-500" />
          <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-cyan-500" />
          <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-brand-400" />

        </div>

      </section>


      {/* METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Analyses */}
        <div className="group rounded-2xl bg-white border border-blue-100 p-5 shadow-card hover:shadow-soft hover:border-brand-200 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Total Analyses
            </span>

            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
              <Layers className="w-4 h-4 text-brand-500" />
            </div>

          </div>

          <p className="text-3xl font-bold text-ink-900 mt-4">
            {analyses.length}
          </p>

          <span className="text-[11px] text-ink-500">
            Tracked in SQLite database
          </span>

        </div>


        {/* Benchmarks */}
        <div className="group rounded-2xl bg-white border border-blue-100 p-5 shadow-card hover:shadow-soft hover:border-cyan-200 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Curated Benchmarks
            </span>

            <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Dna className="w-4 h-4 text-cyan-500" />
            </div>

          </div>

          <p className="text-3xl font-bold text-ink-900 mt-4">
            {benchmarks.length}
          </p>

          <span className="text-[11px] text-ink-500">
            Gold-standard reference pathogens
          </span>

        </div>


        {/* Pipeline */}
        <div className="group rounded-2xl bg-white border border-blue-100 p-5 shadow-card hover:shadow-soft hover:border-brand-200 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Active Pipeline Stages
            </span>

            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-500" />
            </div>

          </div>

          <p className="text-3xl font-bold text-ink-900 mt-4">
            9 / 9
          </p>

          <span className="text-[11px] text-ink-500">
            Full end-to-end stages mapped
          </span>

        </div>


        {/* Scientific Integrity */}
        <div className="group rounded-2xl bg-white border border-blue-100 p-5 shadow-card hover:shadow-soft hover:border-emerald-200 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-ink-500">
              Scientific Integrity
            </span>

            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>

          </div>

          <p className="text-3xl font-bold text-emerald-500 mt-4">
            100%
          </p>

          <span className="text-[11px] text-ink-500">
            Zero synthetic fabrication policy
          </span>

        </div>

      </section>


      {/* BENCHMARKS */}
      <section className="space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">

          <div>

            <div className="flex items-center gap-2">

              <FlaskConical className="w-5 h-5 text-brand-500" />

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


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {benchmarks.map((bench) => (

            <div
              key={bench.accession}
              className="group rounded-2xl bg-white border border-blue-100 hover:border-brand-200 hover:shadow-soft transition-all p-5 flex flex-col justify-between min-h-[220px]"
            >

              <div>

                <div className="flex items-center justify-between mb-4">

                  <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-brand-50 text-brand-600 border border-brand-100">
                    {bench.accession}
                  </span>

                  <span className="text-[11px] text-ink-500 font-mono">
                    {bench.sequence.length} aa
                  </span>

                </div>

                <h4 className="font-semibold text-ink-900 text-base">
                  {bench.name}
                </h4>

                <p className="text-xs text-cyan-600 font-medium mt-1">
                  {bench.organism}
                </p>

                <p className="text-xs text-ink-500 mt-3 line-clamp-3 leading-5">
                  {bench.function_summary}
                </p>

              </div>


              <div className="pt-4 mt-4 border-t border-blue-100 flex items-center justify-between">

                <span className="text-[10px] text-ink-500">
                  PDB: {bench.pdb_reference || 'Available'}
                </span>

                <Link
                  to={`/new-analysis?preset=${bench.accession}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Load Preset
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* RECENT ANALYSES */}
      <section className="space-y-4">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Activity className="w-5 h-5 text-brand-500" />

              <h3 className="text-lg font-bold text-ink-900">
                Recent Pipeline Executions
              </h3>

            </div>

            <p className="text-xs text-ink-500 mt-1">
              Monitor recently submitted analysis workflows.
            </p>

          </div>

          <Link
            to="/new-analysis"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Create New
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

        </div>


        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-card">

          <table className="w-full text-left text-sm text-ink-700">

            <thead className="bg-blue-50 text-[10px] uppercase tracking-wider text-ink-500 border-b border-blue-100">

              <tr>

                <th className="py-3.5 px-4 font-semibold">
                  ID
                </th>

                <th className="py-3.5 px-4 font-semibold">
                  Analysis Title
                </th>

                <th className="py-3.5 px-4 font-semibold">
                  Target Accession
                </th>

                <th className="py-3.5 px-4 font-semibold">
                  Progress
                </th>

                <th className="py-3.5 px-4 font-semibold">
                  Status
                </th>

                <th className="py-3.5 px-4 font-semibold text-right">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-blue-100 font-mono text-xs">

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-12 text-center text-ink-500"
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Activity className="w-4 h-4 animate-pulse text-brand-500" />

                      Loading pipeline records...

                    </div>

                  </td>

                </tr>

              ) : analyses.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-12 text-center"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                        <Database className="w-5 h-5 text-ink-500" />

                      </div>

                      <div>

                        <p className="text-sm text-ink-700">
                          No pipeline runs found
                        </p>

                        <p className="text-xs text-ink-500 mt-1">
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
                    className="hover:bg-blue-50 transition-colors"
                  >

                    <td className="py-3.5 px-4 text-ink-500">
                      #{run.id}
                    </td>

                    <td className="py-3.5 px-4 font-sans font-medium text-ink-900">
                      {run.title}
                    </td>

                    <td className="py-3.5 px-4 text-brand-600">
                      {run.accession}
                    </td>

                    <td className="py-3.5 px-4">

                      <div className="flex items-center gap-2">

                        <div className="w-24 h-1.5 rounded-full bg-blue-100 overflow-hidden">

                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
                            style={{
                              width: `${(run.current_stage / run.total_stages) * 100}%`,
                            }}
                          />

                        </div>

                        <span className="text-[11px] text-ink-500">
                          {run.current_stage}/{run.total_stages}
                        </span>

                      </div>

                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <StatusPill status={run.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">

                      <Link
                        to={`/pipeline/${run.id}`}
                        className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold"
                      >
                        View Pipeline
                        <ArrowRight className="w-3 h-3" />
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

export default DashboardPage;
