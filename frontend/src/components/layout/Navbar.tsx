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
    <header className="h-[72px] border-b border-slate-800/80 bg-[#07111f]/95 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Logo */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Dna className="w-5 h-5 text-white" />

          {/* Online indicator */}
          <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#07111f]" />
        </div>

        {/* Brand text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">

            <h1 className="font-bold text-lg text-white tracking-tight">
              Sequence Logic
            </h1>

            <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold tracking-wide bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 px-2 py-0.5 rounded-md">
              SIH 2026
            </span>

          </div>

          <p className="hidden md:block text-xs text-slate-400 truncate">
            Reverse Vaccinology & Immuno-Informatics Engine
          </p>
        </div>
      </div>

      {/* System status */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Strict Provenance */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300">

          <ShieldCheck className="w-4 h-4 text-cyan-400" />

          <span>
            Strict Provenance
          </span>

        </div>

        {/* Backend status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">

          {/* Status dot */}
          <span className="relative flex h-2.5 w-2.5">

            {/* Pulse animation when online */}
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                backendOnline === true
                  ? 'bg-emerald-400 animate-ping'
                  : 'hidden'
              }`}
            />

            {/* Actual status */}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                backendOnline === true
                  ? 'bg-emerald-400'
                  : backendOnline === false
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            />

          </span>

          {/* Activity icon */}
          <Activity
            className={`w-4 h-4 ${
              backendOnline === true
                ? 'text-emerald-400'
                : backendOnline === false
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}
          />

          {/* Status text */}
          <span className="hidden sm:inline text-slate-300">
            {backendOnline === true
              ? 'Engine Connected'
              : backendOnline === false
              ? 'Engine Offline'
              : 'Connecting...'}
          </span>

        </div>
      </div>

    </header>
  );
};
