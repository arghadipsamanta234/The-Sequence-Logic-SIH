import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-soft text-ink-900 flex flex-col font-sans">

      <Navbar />

      <div className="flex-1 flex overflow-hidden">

        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-surface-soft">
          <div className="w-full max-w-[1600px] mx-auto px-5 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};
