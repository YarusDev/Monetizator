import { TrendingUp, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader } from './BaseFields';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';

interface CasesSettingsProps {
  block: any;
  onChange: (content: any) => void;
}

export const CasesSettings = ({ block, onChange }: CasesSettingsProps) => {
  const content = block.content || {};
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('m_cases')
      .select('*')
      .order('case_number', { ascending: true });
    
    if (data) setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const toggleCaseActive = async (id: string, current: boolean) => {
    await supabase.from('m_cases').update({ is_active: !current }).eq('id', id);
    fetchCases();
  };

  const reorderCase = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cases.length) return;

    const case1 = cases[index];
    const case2 = cases[newIndex];

    // Меняем номера местами
    await Promise.all([
      supabase.from('m_cases').update({ case_number: case2.case_number }).eq('id', case1.id),
      supabase.from('m_cases').update({ case_number: case1.case_number }).eq('id', case2.id)
    ]);

    fetchCases();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Кейсы и результаты" 
        subtitle="Настройка заголовков и порядка отображения кейсов"
        icon={TrendingUp}
      />

      <div className="space-y-6">
        <TextField 
          label="Заголовок блока" 
          value={content.title || block.title} 
          onChange={(v) => handleUpdate('title', v)} 
        />
        <TextAreaField 
          label="Подзаголовок" 
          value={content.subtitle || block.subtitle} 
          onChange={(v) => handleUpdate('subtitle', v)} 
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Управление портфолио</h4>
          {loading && <div className="text-[9px] text-brand-emerald animate-pulse uppercase font-bold">Синхронизация...</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c, index) => (
            <div key={c.id} className={`group p-6 rounded-[2.5rem] border transition-all duration-500 relative flex flex-col justify-between h-full ${c.is_active ? 'bg-white/[0.02] border-white/5 hover:border-brand-emerald/20' : 'bg-black/40 border-white/5 opacity-50 grayscale'}`}>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-[11px] font-black text-brand-emerald border border-brand-emerald/20">
                    {c.case_number}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => reorderCase(index, 'up')}
                      disabled={index === 0}
                      className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-brand-emerald disabled:opacity-0 transition-all"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      onClick={() => reorderCase(index, 'down')}
                      disabled={index === cases.length - 1}
                      className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-brand-emerald disabled:opacity-0 transition-all"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-brand-emerald uppercase tracking-widest">{c.sphere}</span>
                    {c.niche && <span className="text-[9px] text-slate-600 uppercase tracking-widest font-black">/ {c.niche}</span>}
                  </div>
                  <h5 className="text-[11px] font-black text-white uppercase leading-tight line-clamp-2">{c.header}</h5>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${c.is_active ? 'bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                   <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{c.is_active ? 'Опубликован' : 'Черновик'}</span>
                </div>
                
                <button 
                  onClick={() => toggleCaseActive(c.id, c.is_active)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${c.is_active ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-white/5 text-slate-500'}`}
                >
                  {c.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {cases.length === 0 && !loading && (
          <div className="p-12 text-center bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
            <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
              <TrendingUp className="text-slate-800" size={24} />
            </div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Кейсы еще не добавлены</p>
          </div>
        )}
      </div>
    </div>
  );
};
