import { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Case {
  id: string;
  title: string;
  student_name: string;
  metrics: string;
  header: string;
  sub: string;
  problem: string;
  action: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export const CaseManager = ({ cases, onUpdate }: { cases: Case[], onUpdate: () => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Case>>({
    title: '',
    student_name: '',
    metrics: '',
    header: '',
    sub: '',
    problem: '',
    action: '',
    description: '',
    image_url: '',
    is_active: true
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    if (editingId) {
      await supabase.from('m_cases').update(formData).eq('id', editingId);
    } else {
      await supabase.from('m_cases').insert([formData]);
    }
    setIsAdding(false);
    setEditingId(null);
    onUpdate();
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      setFormData({ ...formData, image_url: publicUrl });
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки');
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

  const startEdit = (c: Case) => {
    setFormData(c);
    setEditingId(c.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <Briefcase className="text-purple-500" /> База Кейсов
        </h2>
        <button 
          onClick={() => { setFormData({ title: '', student_name: '', metrics: '', header: '', sub: '', problem: '', action: '', description: '', image_url: '', is_active: true }); setEditingId(null); setIsAdding(true); }}
          className="admin-button-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3"
        >
          <Plus size={16} /> Добавить кейс
        </button>
      </div>

      {isAdding && (
        <div className="glass p-8 rounded-[2.5rem] border-purple-500/20 bg-purple-500/5 mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6">{editingId ? 'Редактировать' : 'Новый'} кейс</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Изображение кейса</label>
              <div className="flex gap-4 items-center">
                <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="flex-grow bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-purple-500/50 transition-colors" placeholder="URL изображения или загрузите файл" />
                <label className="shrink-0 px-6 py-4 glass rounded-2xl cursor-pointer hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400">
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={isUploading} />
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </label>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Ученик / Клиент</label>
              <input type="text" value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-purple-500/50 transition-colors" placeholder="Имя Фамилия" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Результат (Метрика)</label>
              <input type="text" value={formData.metrics} onChange={(e) => setFormData({...formData, metrics: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-purple-500/50 transition-colors" placeholder="+3.5М прибыли / х10 за месяц" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Заголовок (Header)</label>
              <input type="text" value={formData.header} onChange={(e) => setFormData({...formData, header: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-purple-500/50 transition-colors" placeholder="+55 000 ₽ за 14 дней" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Ниша / Подзаголовок (Title)</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-purple-500/50 transition-colors" placeholder="Фотограф (Услуги)" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Краткая суть (Sub)</label>
              <input type="text" value={formData.sub} onChange={(e) => setFormData({...formData, sub: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-purple-500/50 transition-colors" placeholder="Как выйти из ловушки низкого чека..." />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Проблема</label>
              <textarea value={formData.problem} onChange={(e) => setFormData({...formData, problem: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none h-20 resize-none focus:border-purple-500/50 transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Что сделано (Action)</label>
              <textarea value={formData.action} onChange={(e) => setFormData({...formData, action: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none h-20 resize-none focus:border-purple-500/50 transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Финальный результат (Description)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none h-24 resize-none focus:border-purple-500/50 transition-colors" />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors">Сохранить</button>
            <button onClick={() => setIsAdding(false)} className="px-10 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map(item => (
          <div key={item.id} className="glass p-8 rounded-[3rem] bg-white/[0.02] border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Briefcase size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                    <User size={24} />
                 </div>
                 <div>
                    <div className="text-white font-bold">{item.student_name}</div>
                    <div className="text-[#00FFC2] text-xs font-black uppercase tracking-widest">{item.metrics}</div>
                 </div>
              </div>
              <div className="flex gap-2 relative z-10">
                <button onClick={() => startEdit(item)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-purple-400 transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-purple-400 transition-colors">{item.header}</h3>
            <div className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-4">{item.title}</div>
            <p className="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed">{item.sub}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.is_active ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-red-500/10 text-red-500'}`}>
                {item.is_active ? 'Public' : 'Hidden'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cases.length === 0 && !isAdding && (
        <div className="py-40 text-center glass rounded-[3rem]">
          <div className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">Кейсов пока нет</div>
          <p className="text-slate-700 text-[10px] mt-2">Добавьте результаты своих учеников для лендинга</p>
        </div>
      )}
    </div>
  );
};
