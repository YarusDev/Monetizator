import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, Clock, Search, List, LayoutGrid, Calendar, ArrowUpDown } from 'lucide-react';
import type { Task, Client } from './types';

interface TasksManagerProps {
  tasks: Task[];
  clients: Client[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddTask: () => void;
}

export const TasksManager: React.FC<TasksManagerProps> = ({ tasks, clients, searchQuery, setSearchQuery, onAddTask }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(t => 
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'all' || t.status === filterStatus)
    );

    result.sort((a, b) => {
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [tasks, searchQuery, filterStatus, sortOrder]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4 flex-grow max-w-2xl">
             <div className="relative flex-grow">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
               <input 
                 type="text" 
                 placeholder="Поиск задач..." 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)} 
                 className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#00FFC2]/50 outline-none transition-all placeholder:text-slate-700" 
               />
             </div>
             <select 
                value={filterStatus} 
                onChange={(e: any) => setFilterStatus(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm text-slate-400 outline-none focus:border-[#00FFC2]/50 transition-all"
             >
                <option value="all">Все статусы</option>
                <option value="pending">В ожидании</option>
                <option value="completed">Завершено</option>
             </select>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-4 glass rounded-2xl text-slate-500 hover:text-[#00FFC2] transition-all">
                <ArrowUpDown size={20} />
             </button>
             <div className="glass flex p-1 rounded-2xl bg-white/[0.02]">
                <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 text-[#00FFC2]' : 'text-slate-500'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 text-[#00FFC2]' : 'text-slate-500'}`}><List size={18} /></button>
             </div>
          </div>
       </div>

       {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {filteredAndSortedTasks.map(task => (
                <div key={task.id} className={`glass p-6 rounded-[2rem] border-l-4 ${task.status === 'completed' ? 'border-[#00FFC2]' : 'border-blue-500'} hover:scale-[1.02] transition-all cursor-pointer`}>
                   <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-blue-500/10 text-blue-500'}`}>
                         {task.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                         <Calendar size={10} /> {new Date(task.due_date).toLocaleDateString()}
                      </div>
                   </div>
                   <h4 className="font-bold text-white mb-2 leading-tight">{task.title}</h4>
                   <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                      {clients.find(c => c.id === task.client_id)?.full_name || 'Без клиента'}
                   </div>
                </div>
             ))}
             <button onClick={onAddTask} className="glass p-6 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 hover:text-[#00FFC2] hover:border-[#00FFC2]/30 transition-all gap-3 h-full min-h-[160px]">
                <Plus size={32} />
                <div className="text-xs font-black uppercase tracking-widest">Новая задача</div>
             </button>
          </div>
       ) : (
          <div className="glass rounded-[3rem] overflow-hidden border border-white/5">
             <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-slate-600 font-black uppercase text-[9px] tracking-[0.3em]">
                   <tr>
                      <th className="px-10 py-6">Задача</th>
                      <th className="px-10 py-6">Клиент</th>
                      <th className="px-10 py-6">Дедлайн</th>
                      <th className="px-10 py-6 text-right">Статус</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {filteredAndSortedTasks.map(task => (
                      <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                         <td className="px-10 py-6 font-bold text-white">{task.title}</td>
                         <td className="px-10 py-6 text-slate-400">{clients.find(c => c.id === task.client_id)?.full_name || '-'}</td>
                         <td className="px-10 py-6 font-mono text-xs text-slate-500">{new Date(task.due_date).toLocaleDateString()}</td>
                         <td className="px-10 py-6 text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-blue-500/10 text-blue-500'}`}>
                               {task.status === 'completed' ? 'Выполнено' : 'В работе'}
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}
    </div>
  );
};
