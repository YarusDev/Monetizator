import { useState, useEffect } from 'react';
import { Layout, XCircle, Save, Eye, Settings, List, GripVertical } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import LandingPage from '../../../pages/LandingPage';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as LucideIcons from 'lucide-react';

const ICON_CATEGORIES = {
  'Общие': ['Layout', 'Settings', 'Eye', 'Save', 'List', 'GripVertical', 'Search', 'Globe', 'Activity', 'Sparkles'],
  'Бизнес/Финансы': ['Target', 'Zap', 'TrendingUp', 'BarChart3', 'PieChart', 'CreditCard', 'Briefcase', 'DollarSign', 'Coins', 'Wallet'],
  'Команда/Люди': ['Users', 'User', 'Heart', 'Smile', 'Star', 'Handshake', 'MessageCircle', 'MessagesSquare', 'Phone', 'Send'],
  'Результат/Успех': ['Award', 'Medal', 'Trophy', 'Rocket', 'CheckCircle2', 'Shield', 'Flame', 'ZapOff', 'Check', 'Crown'],
  'Интерфейс': ['Plus', 'Minus', 'XCircle', 'ArrowRight', 'ChevronRight', 'Smartphone', 'Laptop', 'Mail', 'Bell', 'Calendar']
};

// Icons library initialized

interface ContentBlock {
  id: string;
  block_key: string;
  title: string;
  subtitle: string;
  is_active: boolean;
  order_index: number;
  content: any;
}

export const MatrixEditor = ({ blocks, onUpdate }: { blocks: ContentBlock[], onUpdate: () => void }) => {
  const [selectedId, setSelectedId] = useState<string | null>(blocks[0]?.id || null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedBlock = blocks.find(b => b.id === selectedId);

  useEffect(() => {
    if (selectedBlock) {
      setEditingBlock({ ...selectedBlock });
      // Scroll preview to block
      const element = document.getElementById(`preview-${selectedBlock.block_key}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedId, blocks]);

  const handleSave = async () => {
    if (!editingBlock) return;
    const { error } = await supabase.from('m_content_blocks').update({
      title: editingBlock.title,
      subtitle: editingBlock.subtitle,
      content: editingBlock.content,
      is_active: editingBlock.is_active
    }).eq('id', editingBlock.id);
    
    if (!error) {
      onUpdate();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);

    const newBlocks = arrayMove(blocks, oldIndex, newIndex);
    
    // Update all indices in DB
    const updates = newBlocks.map((block, idx) => ({
      id: block.id,
      order_index: idx
    }));

    for (const update of updates) {
      await supabase.from('m_content_blocks').update({ order_index: update.order_index }).eq('id', update.id);
    }
    
    setPreviewKey(prev => prev + 1);
    onUpdate();
  };

  const handleUploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      if (file.size > 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер — 1МБ.');
        return null;
      }

      const fileName = `cms/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      alert('Ошибка загрузки');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -mx-4 md:mx-0">
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden bg-black/40 border-b border-white/5 p-2 gap-2">
        <button className="flex-1 py-2 rounded-xl bg-[#00FFC2] text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <List size={14} /> Список
        </button>
        <button className="flex-1 py-2 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Eye size={14} /> Превью
        </button>
        <button className="flex-1 py-2 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Settings size={14} /> Опции
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: BLOCK LIST */}
        <div className="hidden md:flex flex-col w-72 border-r border-white/5 bg-black/20 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-6 px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Структура</span>
            <span className="px-2 py-1 bg-white/5 rounded-md text-[9px] text-slate-500 font-bold">{blocks.length} блоков</span>
          </div>
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {blocks.sort((a,b) => a.order_index - b.order_index).map((block) => (
                  <SortableBlockItem 
                    key={block.id} 
                    block={block} 
                    isSelected={selectedId === block.id} 
                    onSelect={() => setSelectedId(block.id)} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* MIDDLE: LIVE PREVIEW */}
        <div className="flex-1 bg-[#050505] flex flex-col relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-2xl">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${viewMode === 'desktop' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Desktop
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${viewMode === 'mobile' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Mobile
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-zinc-900/30">
             <div className={`mx-auto transition-all duration-500 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden relative ${viewMode === 'desktop' ? 'w-full' : 'w-[375px] h-[812px] rounded-[3rem]'}`}>
                <style>{`
                  .preview-frame header {
                    position: absolute !important;
                    width: 100% !important;
                    left: 0 !important;
                    transform: none !important;
                  }
                  .preview-frame main {
                    padding-top: 0 !important;
                  }
                `}</style>
                <div className="bg-[#050505] h-full overflow-y-auto preview-frame relative" key={previewKey}>
                   <LandingPage />
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT: EDITOR */}
        <div className="hidden lg:flex flex-col w-[480px] border-l border-white/5 bg-black/40 overflow-y-auto custom-scrollbar">
           {editingBlock ? (
             <div className="flex flex-col h-full">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 sticky top-0 z-10 backdrop-blur-md">
                 <div>
                   <div className="text-[10px] text-[#00FFC2] font-black uppercase tracking-[0.2em] mb-1">Редактор</div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">{editingBlock.block_key}</h3>
                 </div>
                 <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#00FFC2] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,194,0.4)] transition-all flex items-center gap-2"
                 >
                   <Save size={14} /> Сохранить
                 </button>
               </div>

               <div className="p-6 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Статус блока</label>
                       <button 
                        onClick={() => setEditingBlock({...editingBlock, is_active: !editingBlock.is_active})}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${editingBlock.is_active ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-red-500/10 text-red-500'}`}
                       >
                        {editingBlock.is_active ? 'Активен' : 'Выключен'}
                       </button>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Заголовок</label>
                       <textarea 
                        value={editingBlock.title || ''}
                        onChange={(e) => setEditingBlock({...editingBlock, title: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[#00FFC2]/30 resize-none font-bold"
                        rows={2}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Подзаголовок</label>
                       <textarea 
                        value={editingBlock.subtitle || ''}
                        onChange={(e) => setEditingBlock({...editingBlock, subtitle: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-white text-xs outline-none focus:border-[#00FFC2]/30 resize-none text-slate-400"
                        rows={3}
                       />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-6">
                    <div className="text-[10px] text-[#00FFC2] font-black uppercase tracking-[0.2em]">Содержимое (JSON)</div>
                    
                    {editingBlock.content && Object.keys(editingBlock.content).map((key) => (
                      <ContentFieldEditor 
                        key={key}
                        label={key}
                        value={editingBlock.content[key]}
                        onUpload={handleUploadImage}
                        isUploading={isUploading}
                        onChange={(newVal) => setEditingBlock({
                          ...editingBlock,
                          content: { ...editingBlock.content, [key]: newVal }
                        })}
                      />
                    ))}
                  </div>
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700 mb-4">
                  <Layout size={32} />
                </div>
                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">Блок не выбран</div>
                <p className="text-xs text-slate-700">Выберите блок из списка слева для начала редактирования</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const IconSelector = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [activeCat, setActiveCat] = useState(Object.keys(ICON_CATEGORIES)[0]);

  return (
    <div className="space-y-3 p-4 bg-black/40 rounded-[2rem] border border-white/5">
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.keys(ICON_CATEGORIES).map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeCat === cat ? 'bg-white text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
        {(ICON_CATEGORIES as any)[activeCat].map((iconName: string) => {
          const IconComp = (LucideIcons as any)[iconName];
          return (
            <button
              key={iconName}
              onClick={() => onChange(iconName)}
              title={iconName}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
                value === iconName 
                  ? 'bg-[#00FFC2]/10 border-[#00FFC2]/30 text-[#00FFC2] shadow-[0_0_20px_rgba(0,255,194,0.1)]' 
                  : 'bg-black/20 border-transparent text-slate-600 hover:border-white/10 hover:text-white'
              }`}
            >
              {IconComp ? <IconComp size={18} /> : iconName[0]}
              <span className="text-[7px] font-bold uppercase truncate w-full text-center">{iconName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ContentFieldEditor = ({ value, onChange, label, onUpload, isUploading }: { value: any, onChange: (v: any) => void, label: string, onUpload?: (f: File, p: string) => Promise<string|null>, isUploading?: boolean }) => {
  const isArray = Array.isArray(value);
  const isString = typeof value === 'string';
  const isLongString = isString && value.length > 50;
  const isIcon = label.toLowerCase().includes('icon');
  const isImage = label.toLowerCase().includes('image');

  if (isArray) {
    return (
      <div className="space-y-3">
        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest flex justify-between items-center">
          {label}
          <button 
            onClick={() => {
              const newItem = value.length > 0 && typeof value[0] === 'object' 
                ? Object.keys(value[0]).reduce((acc, k) => ({ ...acc, [k]: '' }), {}) 
                : '';
              onChange([...value, newItem]);
            }}
            className="text-[#00FFC2] hover:underline"
          >
            + Добавить
          </button>
        </label>
        <div className="space-y-2">
          {value.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 relative group">
              <button 
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <XCircle size={10} />
              </button>
              {typeof item === 'object' ? (
                <div className="space-y-2">
                  {Object.keys(item).map(k => (
                        <div key={k} className="flex flex-col gap-1">
                          <span className="text-[8px] text-slate-700 uppercase font-bold">{k}</span>
                          {k.toLowerCase().includes('icon') ? (
                            <IconSelector value={item[k]} onChange={(val) => {
                              const newArr = [...value];
                              newArr[idx] = { ...item, [k]: val };
                              onChange(newArr);
                            }} />
                          ) : (
                            <input 
                              type="text" 
                              value={item[k] || ''}
                              onChange={(e) => {
                                const newArr = [...value];
                                newArr[idx] = { ...item, [k]: e.target.value };
                                onChange(newArr);
                              }}
                              className="bg-black/40 border border-white/5 rounded-lg px-2 py-1 text-white text-[10px] outline-none"
                            />
                          )}
                        </div>
                  ))}
                </div>
              ) : (
                <input 
                  type="text" 
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[idx] = e.target.value;
                    onChange(newArr);
                  }}
                  className="w-full bg-transparent text-white text-[10px] outline-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{label}</label>
      {isIcon ? (
        <IconSelector value={value} onChange={onChange} />
      ) : isLongString ? (
        <textarea 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] outline-none focus:border-[#00FFC2]/30 resize-none h-24"
        />
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-grow bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-[10px] outline-none focus:border-[#00FFC2]/30"
            />
            {isImage && onUpload && (
              <label className="flex items-center justify-center px-4 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await onUpload(file, label);
                      if (url) onChange(url);
                    }
                  }}
                  disabled={isUploading}
                />
                <span className="text-[9px] font-black uppercase tracking-widest">{isUploading ? '...' : 'UP'}</span>
              </label>
            )}
          </div>
          {isImage && value && (
            <div className="w-full h-32 rounded-2xl overflow-hidden border border-white/10 bg-black/60 group/preview relative">
              <img src={value.startsWith('assets/') ? `/${value}` : value} className="w-full h-full object-contain" alt="Preview" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-all">
                <span className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Image Preview</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SortableBlockItem = ({ block, isSelected, onSelect }: { block: ContentBlock, isSelected: boolean, onSelect: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
        isSelected 
          ? 'bg-[#00FFC2]/10 border-[#00FFC2]/20 text-white' 
          : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-700 hover:text-slate-400 transition-colors">
        <GripVertical size={14} />
      </div>

      <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#00FFC2] text-black' : 'bg-white/5 text-slate-600'}`}>
        <Layout size={14} />
      </div>
      <div className="flex-grow min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-tighter opacity-50">{block.block_key}</div>
        <div className="text-xs font-black truncate uppercase tracking-tight">{block.title || 'Без названия'}</div>
      </div>
    </div>
  );
};
