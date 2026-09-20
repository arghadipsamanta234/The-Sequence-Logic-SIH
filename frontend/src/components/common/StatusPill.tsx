import React from 'react';

interface StatusPillProps {
  status: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  const getColors = () => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'CONNECTED':
      case 'SAFE':
      case 'ANTIGENIC':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'RUNNING':
      case 'PENDING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ADAPTER_PLACEHOLDER':
      case 'BENCHMARK_REFERENCE':
      case 'LOCAL_FALLBACK':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'SERVICE_UNAVAILABLE':
      case 'NOT_AVAILABLE':
      case 'FAILED':
      case 'FLAGGED - EXCLUDED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getLabel = () => {
    switch (status.toUpperCase()) {
      case 'ADAPTER_PLACEHOLDER':
        return 'Adapter Placeholder';
      case 'BENCHMARK_REFERENCE':
        return 'Benchmark Reference';
      case 'LOCAL_FALLBACK':
        return 'Local Fallback';
      case 'SERVICE_UNAVAILABLE':
        return 'Service Unavailable';
      case 'NOT_EVALUATED':
        return 'Not Evaluated';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColors()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {getLabel()}
    </span>
  );
};
