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

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0d1b2a] via-[#0b1928] to-[#07111f] p-6 sm:p-8 lg:p-10">

        {/* Decorative background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Prototype</span>

            <span className="w-1 h-1 rounded-full bg-cyan-400" />

            <span className="text-cyan-400/80">
              Computational Pipeline
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Rational Multi-Epitope
            <span className="block bg-gradient-to-r from-cyan-300 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Vaccine Architecture
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-sm sm:text-base leading-7 text-slate-400">
            Automating the reverse-vaccinology workflow from antigen sequence
            ingestion through epitope prediction, safety filtering, construct
            design, structural analysis, receptor docking, and research
            reporting.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            <Link
              to="/new-analysis"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              Launch New Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/sources"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 font-medium text-sm border border-slate-700/70 transition-all"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              View Data Sources
            </Link>

          </div>
        </div>

        {/* Scientific visual */}
        <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 items-center justify-center">

          <div className="absolute inset-8 rounded-full border border-cyan-400/10" />
          <div className="absolute inset-14 rounded-full border border-cyan-400/10" />

          <div className="w-28 h-28 rounded-3xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center rotate-12">
            <Dna className="w-14 h-14 text-cyan-300 -rotate-12" />
          </div>

          <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-teal-400" />
          <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-indigo-400" />

        </div>
      </section>


      {/* ========================================================= */}
      {/* METRICS */}
      {/* ========================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Analyses */}
        <div className="group rounded-2xl bg-[#0d1b2a]/80 border border-slate-800/80 p-5 hover:border-cyan-400/20 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-400">
              Total Analyses
            </span>

            <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>

          </div>

          <p className="text-3xl font-bold text-white mt-4">
            {analyses.length}
          </p>

          <span className="text-[11px] text-slate-500">
            Tracked in SQLite database
          </span>
        </div>


        {/* Benchmarks */}
        <div className="group rounded-2xl bg-[#0d1b2a]/80 border border-slate-800/80 p-5 hover:border-teal-400/20 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-400">
              Curated Benchmarks
            </span>

            <div className="w-9 h-9 rounded-lg bg-teal-400/10 flex items-center justify-center">
              <Dna className="w-4 h-4 text-teal-400" />
            </div>

          </div>

          <p className="text-3xl font-bold text-white mt-4">
            {benchmarks.length}
          </p>

          <span className="text-[11px] text-slate-500">
            Gold-standard reference pathogens
          </span>
        </div>


        {/* Pipeline */}
        <div className="group rounded-2xl bg-[#0d1b2a]/80 border border-slate-800/80 p-5 hover:border-indigo-400/20 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-400">
              Active Pipeline Stages
            </span>

            <div className="w-9 h-9 rounded-lg bg-indigo-400/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>

          </div>

          <p className="text-3xl font-bold text-white mt-4">
            9 / 9
          </p>

          <span className="text-[11px] text-slate-500">
            Full end-to-end stages mapped
          </span>
        </div>


        {/* Scientific Integrity */}
        <div className="group rounded-2xl bg-[#0d1b2a]/80 border border-slate-800/80 p-5 hover:border-emerald-400/20 transition-all">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-400">
              Scientific Integrity
            </span>

            <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

          </div>

          <p className="text-3xl font-bold text-emerald-400 mt-4">
            100%
          </p>

          <span className="text-[11px] text-slate-500">
            Zero synthetic fabrication policy
          </span>
        </div>

      </section>


      {/* ========================================================= */}
      {/* BENCHMARKS */}
      {/* ========================================================= */}

      <section className="space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">

          <div>
            <div className="flex items-center gap-2">

              <FlaskConical className="w-5 h-5 text-cyan-400" />

              <h3 className="text-lg font-bold text-white">
                Gold-Standard Benchmark Pathogens
              </h3>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              Real, peer-reviewed public biological data ready for immediate
              pipeline analysis.
            </p>
          </div>

          <span className="text-[10px] uppercase tracking-wider text-slate-600">
            {benchmarks.length} references
          </span>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {benchmarks.map((bench) => (

            <div
              key={bench.accession}
              className="group rounded-2xl bg-[#0d1b2a]/70 border border-slate-800/80 hover:border-cyan-400/30 hover:bg-[#0f2032] transition-all p-5 flex flex-col justify-between min-h-[220px]"
            >

              <div>

                <div className="flex items-center justify-between mb-4">

                  <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                    {bench.accession}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {bench.sequence.length} aa
                  </span>

                </div>

                <h4 className="font-semibold text-white text-base">
                  {bench.name}
                </h4>

                <p className="text-xs text-teal-400/90 font-medium mt-1">
                  {bench.organism}
                </p>

                <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-5">
                  {bench.function_summary}
                </p>

              </div>


              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">

                <span className="text-[10px] text-slate-500">
                  PDB: {bench.pdb_reference || 'Available'}
                </span>

                <Link
                  to={`/new-analysis?preset=${bench.accession}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Load Preset
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

              </div>

            </div>

          ))}

        </div>
      </section>


      {/* ========================================================= */}
      {/* RECENT ANALYSES */}
      {/* ========================================================= */}

      <section className="space-y-4">

        <div className="flex items-center justify-between">

          <div>
            <div className="flex items-center gap-2">

              <Activity className="w-5 h-5 text-cyan-400" />

              <h3 className="text-lg font-bold text-white">
                Recent Pipeline Executions
              </h3>

            </div>

            <p className="text-xs text-slate-500 mt-1">
              Monitor recently submitted analysis workflows.
            </p>
          </div>

          <Link
            to="/new-analysis"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Create New
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

        </div>


        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-[#0d1b2a]/60">

          <table className="w-full text-left text-sm text-slate-300">

            <thead className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800/80">

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


            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-500"
                  >
                    <div className="flex items-center justify-center gap-2">

                      <Activity className="w-4 h-4 animate-pulse text-cyan-400" />

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

                      <div className="w-10 h-10 rounded-xl bg-slate-800/70 flex items-center justify-center">
                        <Database className="w-5 h-5 text-slate-500" />
                      </div>

                      <div>

                        <p className="text-sm text-slate-300">
                          No pipeline runs found
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
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
                    className="hover:bg-slate-800/30 transition-colors"
                  >

                    <td className="py-3.5 px-4 text-slate-500">
                      #{run.id}
                    </td>

                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      {run.title}
                    </td>

                    <td className="py-3.5 px-4 text-cyan-400">
                      {run.accession}
                    </td>

                    <td className="py-3.5 px-4">

                      <div className="flex items-center gap-2">

                        <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">

                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
                            style={{
                              width: `${(run.current_stage / run.total_stages) * 100}%`,
                            }}
                          />

                        </div>

                        <span className="text-[11px] text-slate-500">
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
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
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
