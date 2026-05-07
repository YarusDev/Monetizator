import { useState } from 'react';
import { Layout, CheckCircle2, XCircle, Edit2, Save, MoveUp, MoveDown, Globe } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ContentBlock {
  id: string;
  block_key: string;
  title: string;
  subtitle: string;
  is_active: boolean;
  order_index: number;
  content: any;
}

const ContentFieldEditor = ({ value, onChange, label, type = 'text' }: { value: any, onChange: (v: any) => void, label: string, type?: 'text' | 'textarea' | 'array' }) => {
  if (type === 'array') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-4">
        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{label}</label>
        {arr.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative group/item">
            <button 
              onClick={() => onChange(arr.filter((_, i) => i !== idx))}
              className="absolute top-2 right-2 p-1 text-red-500/0 group-hover/item:text-red-500/50 hover:!text-red-500 transition-all"
            >
              <XCircle size={14} />
            </button>

            {typeof item === 'object' && item !== null ? (
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(item).map((k) => (
                  <div key={k} className="space-y-1">
                    <span className="text-[9px] text-slate-700 uppercase font-bold">{k}</span>
                    <input 
                      type="text" 
                      value={item[k] || ''}
                      onChange={(e) => {
                        const newArr = [...arr];
                        newArr[idx] = { ...item, [k]: e.target.value };
                        onChange(newArr);
                      }}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <input 
                type="text" 
                value={item || ''}
                onChange={(e) => {
                  const newArr = [...arr];
                  newArr[idx] = e.target.value;
                  onChange(newArr);
                }}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#00FFC2]/30"
              />
            )}
          </div>
        ))}
        <button 
          onClick={() => {
            const newItem = arr.length > 0 && typeof arr[0] === 'object' 
              ? Object.keys(arr[0]).reduce((acc, k) => ({ ...acc, [k]: '' }), {}) 
              : '';
            onChange([...arr, newItem]);
          }}
          className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] text-slate-500 hover:text-[#00FFC2] hover:border-[#00FFC2]/30 transition-all uppercase font-black"
        >
          + Добавить элемент {label}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[#00FFC2]/30 resize-none"
        />
      ) : (
        <div className="space-y-3">
          <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#00FFC2]/30"
          />
          {label === 'icon' && (
            <div className="text-[9px] text-slate-700 italic flex justify-between">
              <span>Введите название иконки из Lucide (напр. Target, Zap, Users)</span>
              <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-blue-500/50 hover:text-blue-500 transition-colors">Справочник иконок →</a>
            </div>
          )}
          {typeof value === 'string' && (value.startsWith('assets/') || value.startsWith('http')) && (
            <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const BlockManager = ({ blocks, onUpdate }: { blocks: ContentBlock[], onUpdate: () => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ContentBlock>>({});

  const handleSave = async (id: string) => {
    await supabase.from('m_content_blocks').update(formData).eq('id', id);
    setEditingId(null);
    onUpdate();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('m_content_blocks').update({ is_active: !currentStatus }).eq('id', id);
    onUpdate();
  };

  const moveBlock = async (id: string, currentIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) return;

    // Simple swap logic (in a real app, you'd handle all indices)
    await supabase.from('m_content_blocks').update({ order_index: newIndex }).eq('id', id);
    onUpdate();
  };

  const startEdit = (block: ContentBlock) => {
    setFormData(block);
    setEditingId(block.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <Layout className="text-blue-500" /> Структура Лендинга
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#00FFC2]/10 rounded-xl text-[#00FFC2] text-[10px] font-black uppercase tracking-widest border border-[#00FFC2]/20">
          <Globe size={14} /> Live Preview Ready
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blocks.sort((a,b) => a.order_index - b.order_index).map((block) => (
          <div key={block.id} className={`glass p-6 rounded-[2.5rem] transition-all border-white/5 ${block.is_active ? 'bg-white/[0.02]' : 'bg-black/40 grayscale opacity-60'}`}>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6 flex-grow">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveBlock(block.id, block.order_index, 'up')} className="p-1 hover:text-[#00FFC2] transition-colors"><MoveUp size={14} /></button>
                  <button onClick={() => moveBlock(block.id, block.order_index, 'down')} className="p-1 hover:text-[#00FFC2] transition-colors"><MoveDown size={14} /></button>
                </div>

                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                  <Layout size={20} />
                </div>

                {editingId === block.id ? (
                  <div className="flex-grow space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Заголовок секции</label>
                        <input 
                          type="text" 
                          value={formData.title || ''} 
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00FFC2]/50 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Подзаголовок / Акцент</label>
                        <input 
                          type="text" 
                          value={formData.subtitle || ''} 
                          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00FFC2]/50"
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-black/60 border border-white/5 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                        <span className="text-[10px] text-[#00FFC2] font-black uppercase tracking-widest">Контент блока: {block.block_key}</span>
                      </div>
                      
                      {/* Динамические поля контента */}
                      {formData.content && Object.keys(formData.content).map((key) => {
                        const val = formData.content[key];
                        let type: 'text' | 'textarea' | 'array' = 'text';
                        if (Array.isArray(val)) type = 'array';
                        else if (typeof val === 'string' && val.length > 100) type = 'textarea';

                        return (
                          <ContentFieldEditor 
                            key={key}
                            label={key}
                            value={val}
                            type={type}
                            onChange={(newVal) => {
                              setFormData({
                                ...formData,
                                content: {
                                  ...formData.content,
                                  [key]: newVal
                                }
                              });
                            }}
                          />
                        );
                      })}

                      {(!formData.content || Object.keys(formData.content).length === 0) && (
                        <div className="text-[10px] text-slate-700 italic">Дополнительных полей нет</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-black text-white">{block.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{block.subtitle || 'Нет подзаголовка'}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleStatus(block.id, block.is_active)}
                  className={`p-3 rounded-2xl transition-all ${block.is_active ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-red-500/10 text-red-500'}`}
                >
                  {block.is_active ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </button>

                {editingId === block.id ? (
                  <button onClick={() => handleSave(block.id)} className="p-3 bg-[#00FFC2] text-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,255,194,0.4)] transition-all">
                    <Save size={20} />
                  </button>
                ) : (
                  <button onClick={() => startEdit(block)} className="p-3 glass rounded-2xl text-slate-500 hover:text-white transition-all">
                    <Edit2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="py-40 text-center glass rounded-[3rem]">
          <div className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">Блоки не настроены</div>
          <p className="text-slate-700 text-[10px] mt-2">Используйте Matrix Logic для генерации структуры сайта</p>
        </div>
      )}
    </div>
  );
};
