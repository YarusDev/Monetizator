import { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { CaseModal } from './matrix-editor/CaseModal';
import { sanitizeFileName } from '../../../lib/storage';

interface Case {
  id: string;
  student_name: string;
  metrics: string;
  header: string;
  sub: string;
  problem: string;
  action: string;
  mechanics: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sphere?: string;
  niche?: string;
  case_number?: number;
}

export const CaseManager = ({ cases, onUpdate }: { cases: Case[], onUpdate: () => void }) => {
  const [editingCase, setEditingCase] = useState<Partial<Case> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async (data: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const caseData = {
      ...data,
      user_id: user?.id || data.user_id
    };

    if (caseData.id) {
      await supabase.from('m_cases').update(caseData).eq('id', caseData.id);
    } else {
      const nextNumber = Math.max(0, ...cases.map(c => c.case_number || 0)) + 1;
      await supabase.from('m_cases').insert([{ ...caseData, case_number: nextNumber }]);
    }
    setEditingCase(null);
    onUpdate();
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const sanitizedName = sanitizeFileName(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;
      const { error } = await supabase.storage.from('monetizator').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('monetizator').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить этот кейс?')) {
      await supabase.from('m_cases').delete().eq('id', id);
      onUpdate();
    }
  };

  const toggleStatus = async (item: Case) => {
    const newStatus = !item.is_active;
    await supabase.from('m_cases').update({ is_active: newStatus }).eq('id', item.id);
    onUpdate();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
            <Briefcase className="text-purple-500 w-8 h-8" /> База Кейсов
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Управление результатами учеников</p>
        </div>
        <button 
          onClick={() => setEditingCase({ student_name: '', metrics: '', header: '', sub: '', problem: '', action: '', mechanics: '', description: '', image_url: '', is_active: true, sphere: '', niche: '' })}
          className="admin-button-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-500/20 transition-all"
        >
          <Plus size={18} /> Добавить кейс
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map(item => (
          <div key={item.id} className={`glass p-6 rounded-[2.5rem] transition-all group relative border border-white/5 ${!item.is_active ? 'opacity-60 grayscale' : 'bg-white/[0.02] hover:border-purple-500/30'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${item.is_active ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                  {item.case_number || '#'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-white font-bold text-sm truncate">{item.student_name}</span>
                  <span className="text-brand-emerald text-[9px] font-black uppercase tracking-widest truncate">{item.metrics}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => setEditingCase(item)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-purple-400 transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-black text-white leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
                {item.header}
              </h3>
              
              <div className="space-y-1">
                <div className="text-[9px] text-purple-400 font-black uppercase tracking-[0.1em]">
                  {item.sphere}
                </div>
                {item.niche && (
                  <div className="text-[8px] text-slate-600 uppercase tracking-widest font-bold">
                    {item.niche}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed font-medium italic">
                "{item.sub}"
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button 
                onClick={() => toggleStatus(item)}
                className="flex items-center gap-3 group/toggle cursor-pointer"
              >
                <div className={`w-8 h-4 rounded-full relative transition-all duration-300 ${item.is_active ? 'bg-brand-emerald' : 'bg-slate-700'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${item.is_active ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
                <div className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${item.is_active ? 'text-brand-emerald' : 'text-slate-600'}`}>
                  {item.is_active ? 'Опубликован' : 'Скрыт'}
                </div>
              </button>
              
              {item.image_url && (
                <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/10 bg-black">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {cases.length === 0 && !editingCase && (
        <div className="py-40 text-center glass rounded-[3rem] border border-dashed border-white/5">
          <div className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">База кейсов пуста</div>
          <p className="text-slate-700 text-[10px] mt-2">Добавьте результаты своих учеников для лендинга</p>
        </div>
      )}

      {editingCase && (
        <CaseModal 
          initialData={editingCase}
          onClose={() => setEditingCase(null)}
          onSave={handleSave}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};
