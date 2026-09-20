import React, { useEffect, useState } from 'react';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  Server,
  Cpu,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import type { DataSourceItem } from '../services/types';
import { StatusPill } from '../components/common/StatusPill';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const data = await api.getDataSources();
        setSources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-400 tracking-wider">
          <Database className="w-4 h-4" />
          <span>Scientific Tool Integrations & Integrity Status</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Data Sources & Computational Adapters</h2>
        <p className="text-xs text-slate-400 mt-1">
          Every external database, web service, and local simulation tool integrated into the Sequence Logic pipeline.
        </p>
      </div>

      {/* Integrity Directive Alert */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Transparency Directive</span>
        </div>
        <p className="leading-relaxed">
          The system never claims an external service is operational unless verified.
          When legacy academic servers (e.g. VaxiJen, ANTIGENpro) are unreachable, or when intensive high-performance computing
          tools (e.g. AutoDock Vina, GROMACS) are absent from the host system, the pipeline uses explicit fallback adapters and
          reports results with separate labeling rather than inventing values.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 flex items-center justify-center text-slate-400 font-mono text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
            <span>Pinging scientific adapters and endpoints...</span>
          </div>
        ) : (
          sources.map((src) => (
            <div
              key={src.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {src.category}
                  </span>
                  <StatusPill status={src.status} />
                </div>
                <h3 className="font-bold text-base text-white">{src.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{src.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  {src.is_local ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 text-teal-400" />
                      <span>Local Engine</span>
                    </>
                  ) : (
                    <>
                      <Server className="w-3.5 h-3.5 text-blue-400" />
                      <span>Remote REST / Web Form</span>
                    </>
                  )}
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <span>Docs / URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
