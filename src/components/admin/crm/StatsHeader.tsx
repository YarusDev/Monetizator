import React from 'react';
import {  } from 'lucide-react';
import type { Lead, Stage } from './types';

interface StatsHeaderProps {
  stages: Stage[];
  leads: Lead[];
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ stages, leads }) => {
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const lostLeads = leads.filter(l => l.status === 'lost').length;
  const totalLeads = leads.length;
  const totalConversion = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';
  const rejectRate = totalLeads > 0 ? ((lostLeads / totalLeads) * 100).toFixed(1) : '0';

  const stats = stages.map((stage, idx) => {
    const count = leads.filter(l => l.status === stage.key).length;
    
    const totalConv = totalLeads > 0 ? (count / totalLeads * 100).toFixed(1) : '0';
    let stepConversion = '100';
    
    if (idx > 0) {
       const prevCount = leads.filter(l => l.status === stages[idx-1].key).length;
       stepConversion = prevCount > 0 ? (count / prevCount * 100).toFixed(1) : '0';
    }
    
    return { ...stage, count, stepConversion, totalConv };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8 animate-in fade-in duration-700">
      {/* Общая конверсия */}
      <div className="glass p-6 rounded-[2rem] border border-[#00FFC2]/20 bg-[#00FFC2]/5 relative overflow-hidden group">
        <div className="text-[9px] uppercase font-black text-[#00FFC2] mb-4 tracking-[0.2em]">Продажи (Win)</div>
        <div className="flex items-end justify-between mb-4">
          <div className="text-4xl font-black text-white tracking-tighter leading-none">{totalConversion}%</div>
          <div className="text-[8px] text-slate-500 font-black tracking-widest uppercase">Всего: {wonLeads}</div>
        </div>
      </div>

      {/* Процент отказов */}
      <div className="glass p-6 rounded-[2rem] border border-red-500/20 bg-red-500/5 relative overflow-hidden group">
        <div className="text-[9px] uppercase font-black text-red-500 mb-4 tracking-[0.2em]">Отказы (Lost)</div>
        <div className="flex items-end justify-between mb-4">
          <div className="text-4xl font-black text-white tracking-tighter leading-none">{rejectRate}%</div>
          <div className="text-[8px] text-slate-500 font-black tracking-widest uppercase">Всего: {lostLeads}</div>
        </div>
      </div>

      {stats.map((s, idx) => (
        <div key={s.id} className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#00FFC2]/20 transition-all">
          <div className={`absolute top-0 left-0 w-1 h-full ${s.color} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
          <div className="text-[9px] uppercase font-black text-slate-600 mb-4 tracking-[0.2em]">{s.title}</div>
          <div className="flex items-end justify-between mb-4">
            <div className="text-4xl font-black text-white tracking-tighter leading-none">{s.count}</div>
          </div>
          <div className="space-y-1.5">
             <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 bg-white/[0.03] p-2 rounded-xl border border-white/5">
                {idx === 0 ? 'ВХОД. ПОТОК: ' : 'ОТ ПРЕДЫДУЩ.: '} <span className="text-white ml-auto">{s.stepConversion}%</span>
             </div>
             <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 bg-[#00FFC2]/5 p-2 rounded-xl border border-[#00FFC2]/10">
                ОТ ОБЩЕГО: <span className="text-[#00FFC2] ml-auto">{s.totalConv}%</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
