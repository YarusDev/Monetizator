import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { Deal, Client } from './types';

interface FinanceManagerProps {
  deals: Deal[];
  clients: Client[];
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({ deals, clients }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Общая выручка</div>
             <div className="text-5xl font-black text-white">{deals.reduce((acc, d) => acc + d.amount, 0).toLocaleString()} <span className="text-xl text-[#00FFC2] font-black">₽</span></div>
             <div className="mt-4 flex items-center gap-2 text-xs text-[#00FFC2] font-black"><TrendingUp size={16} /> +12% за месяц</div>
          </div>
          <div className="glass p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Всего сделок</div>
             <div className="text-5xl font-black text-white">{deals.length}</div>
             <div className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">Обработано заказов</div>
          </div>
          <div className="glass p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Повторные продажи</div>
             <div className="text-5xl font-black text-white">{deals.filter(d => d.is_repeat).length}</div>
             <div className="mt-4 text-xs text-slate-500 font-bold">LTV Boost Active</div>
          </div>
       </div>

       <div className="glass rounded-[3rem] overflow-hidden border border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-slate-600 font-black uppercase text-[9px] tracking-[0.3em] shadow-xl">
              <tr><th className="px-10 py-7">Дата</th><th className="px-10 py-7">Клиент</th><th className="px-10 py-7">Продукт / Заметка</th><th className="px-10 py-7 text-right">Сумма</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {deals.map(d => (
                <tr key={d.id} className="hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6 text-slate-500 font-mono text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="px-10 py-6">
                     <div className="font-bold text-white">{clients.find(c => c.id === d.client_id)?.full_name || 'Неизвестен'}</div>
                     {d.is_repeat && <span className="text-[8px] font-black uppercase bg-[#00FFC2]/10 text-[#00FFC2] px-1.5 py-0.5 rounded ml-2">Repeat</span>}
                  </td>
                  <td className="px-10 py-6">
                     <div className="text-xs font-black text-slate-300">{d.product_name}</div>
                     <div className="text-[10px] text-slate-600 truncate max-w-xs">{d.note}</div>
                  </td>
                  <td className="px-10 py-6 text-right font-black text-xl text-white">{d.amount.toLocaleString()} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
};
