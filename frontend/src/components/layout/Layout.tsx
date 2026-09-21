import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-scientific-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top navigation */}
      <Navbar />

      {/* Main application area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-scientific-950">
          <div className="w-full max-w-[1600px] mx-auto px-6 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};
