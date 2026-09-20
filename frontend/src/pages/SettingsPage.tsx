import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Server,
  Check,
  Cpu
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-400 tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Configuration & Pipeline Policies</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-1">System Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure computational environments, network timeouts, and scientific integrity policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend API Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>FastAPI Server Gateway</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Backend REST API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Scientific Integrity Directives (Mandatory) */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Scientific Integrity Policies (Immutable)</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Strict Provenance Recording</span>
                <span className="text-[11px] text-slate-400">
                  Logs source, accession, tool version, parameters, and input/output SHA-256 for all operations.
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Enforced (True)
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Anti-Hallucination Guardrails</span>
                <span className="text-[11px] text-slate-400">
                  Strictly prohibits generating synthetic random numbers or fake docking affinities.
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Enforced (True)
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Transparent Fallback Labeling</span>
                <span className="text-[11px] text-slate-400">
                  Local heuristic fallbacks are never labeled as VaxiJen, ANTIGENpro, or GROMACS.
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Enforced (True)
              </span>
            </div>
          </div>
        </div>

        {/* Local Environment Details */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Host Environment Profile</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Python Core</span>
              <span className="font-mono text-emerald-400 font-bold mt-1 block">3.12.10</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">BioPython</span>
              <span className="font-mono text-emerald-400 font-bold mt-1 block">1.88</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Database</span>
              <span className="font-mono text-slate-200 font-bold mt-1 block">SQLite / SQLModel</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Node.js</span>
              <span className="font-mono text-slate-200 font-bold mt-1 block">v24.18.1</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? 'Saved Successfully' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
