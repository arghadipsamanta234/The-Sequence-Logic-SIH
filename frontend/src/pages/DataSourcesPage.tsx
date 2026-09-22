import React, { useEffect, useState } from 'react';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  Server,
  Cpu,
  Loader2,
  Globe2,
  Activity,
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-[11px] font-bold uppercase tracking-[0.12em]">
          <Database className="w-3.5 h-3.5" />
          <span>Scientific Tool Integrations</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight mt-3">
          Data Sources & Computational Adapters
        </h2>

        <p className="text-sm text-ink-500 mt-2 max-w-3xl leading-relaxed">
          Every external database, web service, and local simulation tool
          integrated into the Sequence Logic pipeline.
        </p>
      </div>

      {/* Integrity Directive */}
      <div className="soft-card p-5 sm:p-6 bg-gradient-to-r from-brand-50/70 to-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-ink-900">
                Strict Transparency Directive
              </h3>

              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                <Activity className="w-3 h-3" />
                Integrity Active
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-ink-600 leading-relaxed">
              The system never claims an external service is operational unless
              verified. When legacy academic servers (e.g. VaxiJen,
              ANTIGENpro) are unreachable, or when intensive high-performance
              computing tools (e.g. AutoDock Vina, GROMACS) are absent from the
              host system, the pipeline uses explicit fallback adapters and
              reports results with separate labeling rather than inventing
              values.
            </p>
          </div>
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="section-title">Connected Scientific Sources</h3>
          <p className="section-description mt-1">
            Live status and integration information for configured adapters.
          </p>
        </div>

        {!loading && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-ink-600 shadow-sm">
            <Globe2 className="w-4 h-4 text-brand-500" />
            <span>
              <span className="font-semibold text-ink-900">
                {sources.length}
              </span>{' '}
              sources
            </span>
          </div>
        )}
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="md:col-span-2 soft-card py-20 flex flex-col items-center justify-center text-ink-500">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            </div>

            <p className="text-sm font-semibold text-ink-700">
              Pinging scientific adapters and endpoints...
            </p>

            <p className="text-xs text-ink-500 mt-1">
              Verifying configured data sources
            </p>
          </div>
        ) : sources.length === 0 ? (
          <div className="md:col-span-2 soft-card py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-brand-500" />
            </div>

            <h3 className="font-semibold text-ink-900">
              No data sources configured
            </h3>

            <p className="text-sm text-ink-500 mt-1">
              No scientific adapters were returned by the backend.
            </p>
          </div>
        ) : (
          sources.map((src) => (
            <div
              key={src.id}
              className="soft-card p-5 flex flex-col justify-between gap-5 hover:border-brand-200 hover:shadow-soft transition-all duration-200"
            >
              {/* Source Information */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-100 text-[10px] font-bold uppercase tracking-wide text-brand-600">
                    {src.category}
                  </span>

                  <StatusPill status={src.status} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      {src.is_local ? (
                        <Cpu className="w-4 h-4 text-brand-600" />
                      ) : (
                        <Server className="w-4 h-4 text-brand-600" />
                      )}
                    </div>

                    <h3 className="font-bold text-base text-ink-900">
                      {src.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-500 leading-relaxed mt-3">
                    {src.description}
                  </p>
                </div>
              </div>

              {/* Source Footer */}
              <div className="pt-4 border-t border-blue-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  {src.is_local ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <Cpu className="w-3.5 h-3.5 text-brand-500" />
                      <span>Local Engine</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                      <Server className="w-3.5 h-3.5 text-brand-500" />
                      <span>Remote REST / Web Form</span>
                    </>
                  )}
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span>Docs / URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};