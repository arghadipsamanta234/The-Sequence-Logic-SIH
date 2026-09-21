import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Database,
  Sliders,
  Workflow,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/new-analysis',
      label: 'New Analysis',
      icon: PlusCircle,
    },
    {
      to: '/sources',
      label: 'Data Sources & Adapters',
      icon: Database,
    },
    {
      to: '/settings',
      label: 'Settings & Policy',
      icon: Sliders,
    },
  ];

  const workflowStages = [
    'Input Sequence',
    'Antigenicity Screening',
    'Epitope Prediction',
    'Safety Filtering',
    'Vaccine Assembly',
    'Physicochem / Structure',
    'Docking & Stability',
    'Ranked Candidates',
    'Research Report',
  ];

  return (
    <aside className="w-64 border-r border-blue-100 bg-white flex flex-col justify-between shrink-0">

      <div className="p-4 space-y-6 overflow-y-auto">

        {/* Navigation */}

        <div>

          <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">
            Pipeline Navigation
          </div>

          <nav className="space-y-1.5">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50 text-brand-600 border-brand-100 shadow-sm'
                        : 'text-ink-600 border-transparent hover:text-brand-700 hover:bg-blue-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${
                          isActive
                            ? 'text-brand-500'
                            : 'text-ink-500 group-hover:text-brand-500'
                        }`}
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-brand-500" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* Workflow */}

        <div className="border border-blue-100 rounded-2xl bg-surface-soft overflow-hidden">

          <div className="px-4 py-3 border-b border-blue-100">

            <div className="flex items-center gap-2">

              <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                <Workflow className="w-4 h-4 text-brand-500" />
              </div>

              <div>
                <div className="text-xs font-semibold text-ink-900">
                  9-Stage Workflow
                </div>

                <div className="text-[10px] text-ink-500">
                  Analysis pipeline
                </div>
              </div>

            </div>

          </div>

          <div className="p-3">

            <ol className="space-y-1.5">

              {workflowStages.map((stage, index) => (

                <li
                  key={stage}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-blue-50 transition-colors"
                >

                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-100 border border-brand-200 text-[9px] font-semibold text-brand-700 shrink-0">
                    {index + 1}
                  </span>

                  <span className="text-[10px] leading-tight text-ink-600">
                    {stage}
                  </span>

                </li>

              ))}

            </ol>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="p-4 border-t border-blue-100">

        <div className="rounded-xl bg-brand-50 border border-brand-100 p-3">

          <div className="flex items-center gap-2 mb-1">

            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <p className="font-medium text-xs text-brand-800">
              BioPython 1.88 + FastAPI
            </p>

          </div>

          <p className="text-[10px] leading-relaxed text-brand-600">
            Strict Scientific Integrity Engine
          </p>

        </div>

      </div>

    </aside>
  );
};
