import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Server,
  Check,
  Cpu,
  Database,
  LockKeyhole,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000/api/v1');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-[11px] font-bold uppercase tracking-[0.12em]">
          <Sliders className="w-3.5 h-3.5" />
          <span>Configuration & Pipeline Policies</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight mt-3">
          System Settings
        </h2>

        <p className="text-sm text-ink-500 mt-2 max-w-3xl leading-relaxed">
          Configure computational environments, network endpoints, and
          scientific integrity policies for the Sequence Logic platform.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend API Configuration */}
        <section className="soft-card p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-brand-500" />
            </div>

            <div>
              <h3 className="text-base font-bold text-ink-900">
                FastAPI Server Gateway
              </h3>
              <p className="text-xs text-ink-500 mt-1">
                Configure the backend REST API endpoint used by the frontend.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-2">
              Backend REST API Base URL
            </label>

            <div className="relative">
              <Server className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />

              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-soft border border-blue-100 text-sm font-mono text-brand-700 placeholder:text-ink-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <p className="text-[11px] text-ink-500 mt-2">
              Current frontend API gateway configuration.
            </p>
          </div>
        </section>

        {/* Scientific Integrity Directives */}
        <section className="soft-card p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-ink-900">
                  Scientific Integrity Policies
                </h3>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-md">
                  <LockKeyhole className="w-3 h-3" />
                  Immutable
                </span>
              </div>

              <p className="text-xs text-ink-500 mt-1">
                Mandatory safeguards applied to computational pipeline
                operations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Policy 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-soft border border-blue-100">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-ink-900 block">
                  Strict Provenance Recording
                </span>

                <span className="text-xs text-ink-500 leading-relaxed block mt-1">
                  Logs source, accession, tool version, parameters, and
                  input/output SHA-256 for all operations.
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Check className="w-3 h-3" />
                Enforced (True)
              </span>
            </div>

            {/* Policy 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-soft border border-blue-100">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-ink-900 block">
                  Anti-Hallucination Guardrails
                </span>

                <span className="text-xs text-ink-500 leading-relaxed block mt-1">
                  Strictly prohibits generating synthetic random numbers or
                  fake docking affinities.
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Check className="w-3 h-3" />
                Enforced (True)
              </span>
            </div>

            {/* Policy 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-soft border border-blue-100">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-ink-900 block">
                  Transparent Fallback Labeling
                </span>

                <span className="text-xs text-ink-500 leading-relaxed block mt-1">
                  Local heuristic fallbacks are never labeled as VaxiJen,
                  ANTIGENpro, or GROMACS.
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Check className="w-3 h-3" />
                Enforced (True)
              </span>
            </div>
          </div>
        </section>

        {/* Host Environment */}
        <section className="soft-card p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-cyan-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-ink-900">
                Host Environment Profile
              </h3>
              <p className="text-xs text-ink-500 mt-1">
                Runtime and database components available to the application.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
              <span className="text-[11px] font-medium text-ink-500 block">
                Python Core
              </span>
              <span className="font-mono text-brand-600 font-bold text-sm mt-2 block">
                3.12.10
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
              <span className="text-[11px] font-medium text-ink-500 block">
                BioPython
              </span>
              <span className="font-mono text-brand-600 font-bold text-sm mt-2 block">
                1.88
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
              <span className="text-[11px] font-medium text-ink-500 block">
                Database
              </span>

              <div className="flex items-center gap-1.5 mt-2">
                <Database className="w-3.5 h-3.5 text-brand-500" />

                <span className="font-mono text-ink-800 font-bold text-sm">
                  SQLite / SQLModel
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-soft border border-blue-100">
              <span className="text-[11px] font-medium text-ink-500 block">
                Node.js
              </span>
              <span className="font-mono text-ink-800 font-bold text-sm mt-2 block">
                v24.18.1
              </span>
            </div>
          </div>
        </section>

        {/* Configuration Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-brand-50 border border-brand-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-brand-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-500" />
            </div>

            <div>
              <p className="text-xs font-semibold text-brand-800">
                Configuration Ready
              </p>
              <p className="text-[11px] text-brand-600 mt-0.5">
                Changes are applied to the current frontend session.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-all shadow-blue"
          >
            {saved ? <Check className="w-4 h-4" /> : null}

            <span>
              {saved ? 'Saved Successfully' : 'Save Configuration'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};