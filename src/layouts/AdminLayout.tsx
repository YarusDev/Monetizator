import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../admin.css';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-platform min-h-screen bg-[#0B0C10] text-slate-300">
      <header className="h-16 border-b border-white/5 bg-[#0F1014] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div 
            className="text-xl font-bold text-white cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/admin')}
          >
            <span className="text-[#00FFC2]">MONETIZATOR</span>
            <span className="text-xs opacity-50 font-mono">ADMIN</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5">
             <button 
               onClick={() => navigate('/admin/crm')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${window.location.pathname.includes('/crm') ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:text-white'}`}
             >
               CRM Matrix
             </button>
             <button 
               onClick={() => navigate('/admin/cms')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${window.location.pathname.includes('/cms') ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:text-white'}`}
             >
               Content Center
             </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <span className="text-sm text-white font-medium">Сергей Осипук</span>
            <span className="text-[10px] text-[#00FFC2] uppercase tracking-wider">Expert</span>
          </div>
          <button 
            onClick={() => {/* Logout logic later */}}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="admin-platform-content min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
