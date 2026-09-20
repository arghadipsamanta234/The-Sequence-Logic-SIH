import React, { useEffect, useState } from 'react';
import { Dna, ShieldCheck, Activity } from 'lucide-react';
import { api } from '../../services/api';

export const Navbar: React.FC = () => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const ping = async () => {
      try {
        await api.checkHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    };
    ping();
    const interval = setInterval(ping, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Dna className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-tight">Sequence Logic</h1>
            <span className="text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
              SIH 2026 Prototype
            </span>
          </div>
          <p className="text-xs text-slate-400">Reverse Vaccinology & Immuno-Informatics Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Strict Provenance Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Provenance Active</span>
        </div>

        {/* Backend Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
          <Activity
            className={`w-4 h-4 ${
              backendOnline === true
                ? 'text-emerald-400 animate-pulse'
                : backendOnline === false
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}
          />
          <span className="text-slate-300">
            {backendOnline === true
              ? 'FastAPI Engine: Connected'
              : backendOnline === false
              ? 'FastAPI Engine: Offline'
              : 'Connecting...'}
          </span>
        </div>
      </div>
    </header>
  );
};
