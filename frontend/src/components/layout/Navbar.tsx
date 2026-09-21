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
    <header className="h-[72px] bg-white border-b border-blue-100 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">

      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-blue">
          <Dna className="w-5 h-5 text-white" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">

            <h1 className="font-bold text-lg text-ink-900 tracking-tight">
              Sequence Logic
            </h1>

            <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wide bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 rounded-md">
              SIH 2026
            </span>

          </div>

          <p className="hidden md:block text-xs text-ink-500 truncate">
            Reverse Vaccinology & Immuno-Informatics Engine
          </p>
        </div>

      </div>

      {/* Status */}
      <div className="flex items-center gap-2 sm:gap-3">

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-100 text-xs text-brand-700">

          <ShieldCheck className="w-4 h-4 text-brand-500" />

          <span>
            Strict Provenance
          </span>

        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-soft border border-blue-100 text-xs">

          <span className="relative flex h-2.5 w-2.5">

            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                backendOnline === true
                  ? 'bg-emerald-400 animate-ping'
                  : 'hidden'
              }`}
            />

            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                backendOnline === true
                  ? 'bg-emerald-500'
                  : backendOnline === false
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            />

          </span>

          <Activity
            className={`w-4 h-4 ${
              backendOnline === true
                ? 'text-emerald-500'
                : backendOnline === false
                ? 'text-rose-500'
                : 'text-amber-500'
            }`}
          />

          <span className="hidden sm:inline text-ink-700">
            {backendOnline === true
              ? 'System Online'
              : backendOnline === false
              ? 'Engine Offline'
              : 'Connecting...'}
          </span>

        </div>

      </div>

    </header>
  );
};
