import React from 'react';
import { Search, Building2, User, Star, Zap, Snowflake } from 'lucide-react';
import type { Client, Lead } from './types';

interface ClientManagerProps {
  clients: Client[];
  leads: Lead[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: 'cards' | 'list' | 'kanban';
  setActiveTab: (tab: 'cards' | 'list' | 'kanban') => void;
  onClientClick: (client: Client) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ clients, leads, searchQuery, setSearchQuery, activeTab, setActiveTab, onClientClick }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
       <div className="flex items-center justify-between mb-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Поиск в базе..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#00FFC2]/50 outline-none transition-all placeholder:text-slate-700" 
            />
          </div>
          <div className="glass flex p-1 rounded-2xl bg-white/[0.02]">
             {['cards', 'list', 'kanban'].map((tab: any) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white/10 text-[#00FFC2]' : 'text-slate-500'}`}
                >
                   {tab === 'cards' ? 'Карточки' : tab === 'list' ? 'Список' : 'Сегменты'}
                </button>
             ))}
          </div>
       </div>

       {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {clients.map(client => (
                <div key={client.id} className="glass p-8 rounded-[2.5rem] group cursor-pointer hover:border-[#00FFC2]/30 transition-all relative overflow-hidden" onClick={() => onClientClick(client)}>
                   <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${client.type === 'company' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center border border-white/5`}>
                         {client.type === 'company' ? <Building2 size={24} /> : <User size={24} />}
                      </div>
                      <div className="flex items-center gap-2">
                         {leads.some(l => (l.name === client.full_name || l.contact === client.email) && !['won', 'lost'].includes(l.status)) && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-[#00FFC2]/10 rounded-lg">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] animate-pulse shadow-[0_0_8px_#00FFC2]"></div>
                               <span className="text-[8px] font-black text-[#00FFC2] uppercase">В работе</span>
                            </div>
                         )}
                         {client.total_spent > 100000 && <div className="text-amber-500"><Star size={20} fill="currentColor" /></div>}
                      </div>
                   </div>
                   <h3 className="font-bold text-xl text-white group-hover:text-[#00FFC2] transition-colors">{client.full_name}</h3>
                   <div className="flex items-center justify-between mt-2">
                      <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{client.type === 'company' ? 'Компания' : 'Частное лицо'}</div>
                      <div className="text-xs font-black text-[#00FFC2]">{client.total_spent.toLocaleString()} ₽</div>
                   </div>
                </div>
             ))}
          </div>
       )}

       {activeTab === 'list' && (
          <div className="glass rounded-[3rem] overflow-hidden border border-white/5">
             <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-slate-600 font-black uppercase text-[9px] tracking-[0.3em]">
                   <tr>
                      <th className="px-10 py-6">Клиент</th>
                      <th className="px-10 py-6">Тип</th>
                      <th className="px-10 py-6">Контакт</th>
                      <th className="px-10 py-6 text-right">Выручка</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {clients.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => onClientClick(c)}>
                         <td className="px-10 py-6 font-bold text-white">{c.full_name}</td>
                         <td className="px-10 py-6"><span className={`px-2 py-1 rounded text-[9px] uppercase font-black ${c.type === 'company' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>{c.type === 'company' ? 'Компания' : 'Контакт'}</span></td>
                         <td className="px-10 py-6 text-slate-500 font-mono text-xs">{c.email || c.phone || c.telegram || '-'}</td>
                         <td className="px-10 py-6 text-right font-black text-white">{c.total_spent.toLocaleString()} ₽</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}

       {activeTab === 'kanban' && (
          <div className="flex gap-8 overflow-x-auto pb-10">
             {[
                { title: 'В работе', key: 'active', icon: <Zap className="text-[#00FFC2]" />, filter: (c: Client) => leads.some(l => (l.name === c.full_name || l.contact === c.email) && !['won', 'lost'].includes(l.status)) },
                { title: 'Остывшие', key: 'cold', icon: <Snowflake className="text-blue-400" />, filter: (c: Client) => c.total_spent > 0 && !leads.some(l => (l.name === c.full_name || l.contact === c.email) && !['won', 'lost'].includes(l.status)) },
                { title: 'Повторные', key: 'repeat', icon: <Star className="text-amber-500" />, filter: (c: Client) => c.total_spent > 0 && leads.filter(l => (l.name === c.full_name || l.contact === c.email)).length > 1 }
             ].map(segment => (
                <div key={segment.key} className="w-96 flex-shrink-0">
                   <div className="flex items-center justify-between mb-6 px-4">
                      <div className="flex items-center gap-3">
                         {segment.icon}
                         <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">{segment.title}</h3>
                      </div>
                   </div>
                   <div className="space-y-4 min-h-[500px] p-4 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
                      {clients.filter(segment.filter).map(c => (
                         <div key={c.id} className="glass p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all cursor-pointer" onClick={() => onClientClick(c)}>
                            <div className="font-bold text-white mb-2">{c.full_name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{c.total_spent.toLocaleString()} ₽</div>
                         </div>
                      ))}
                   </div>
                </div>
             ))}
             {/* Добавление сегмента */}
             <div className="w-96 flex-shrink-0">
                <div className="mb-6 px-4 flex items-center gap-3">
                   <div className="w-4 h-4 rounded bg-white/10"></div>
                   <h3 className="font-black text-xs uppercase tracking-widest text-slate-700 italic">Добавить сегмент...</h3>
                </div>
                <button className="w-full h-[500px] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-800 hover:text-[#00FFC2] hover:border-[#00FFC2]/20 transition-all gap-4">
                   <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center">
                      <Search size={24} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Создать фильтр</span>
                </button>
             </div>
          </div>
       )}
    </div>
  );
};
