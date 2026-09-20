import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Database,
  Sliders,
  Workflow
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/new-analysis', label: 'New Analysis', icon: PlusCircle },
    { to: '/sources', label: 'Data Sources & Adapters', icon: Database },
    { to: '/settings', label: 'Settings & Policy', icon: Sliders },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Pipeline Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Workflow Stages Quick Reference */}
        <div className="border border-slate-800 rounded-xl p-3.5 bg-slate-950/40 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-2">
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span>9-Stage Workflow</span>
          </div>
          <ol className="space-y-1 text-slate-400 list-decimal list-inside text-[11px]">
            <li>Input Sequence</li>
            <li>Antigenicity Screening</li>
            <li>Epitope Prediction</li>
            <li>Safety Filtering</li>
            <li>Vaccine Assembly</li>
            <li>Physicochem / Structure</li>
            <li>Docking & Stability</li>
            <li>Ranked Candidates</li>
            <li>Research Report</li>
          </ol>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
        <p className="font-medium text-slate-300">BioPython 1.88 + FastAPI</p>
        <p className="text-[10px] mt-0.5 text-slate-400">Strict Scientific Integrity Engine</p>
      </div>
    </aside>
  );
};
