import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface CaseModalProps {
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => void;
  onUpload?: (file: File) => Promise<string | null>;
  isUploading?: boolean;
}

export const CaseModal = ({ initialData, onClose, onSave, onUpload, isUploading }: CaseModalProps) => {
  const [data, setData] = useState(JSON.parse(JSON.stringify(initialData)));

  const getImageUrl = (d: any) => {
    const img = d.image_url || '';
    if (!img) return '';
    return img;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Редактировать кейс</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="space-y-6">
            {/* Image Section */}
            <div className="space-y-3">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Изображение кейса</span>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={data.image_url || ''}
                  onChange={(e) => setData({ ...data, image_url: e.target.value })}
                  className="flex-grow bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 transition-all"
                  placeholder="URL изображения..."
                />
                <label className="px-6 rounded-2xl bg-[#00FFC2] text-black font-black text-[9px] uppercase tracking-widest flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={async (e) => {
                       const file = e.target.files?.[0];
                       if (file && onUpload) {
                         const url = await onUpload(file);
                         if (url) setData({ ...data, image_url: url });
                       }
                    }}
                    disabled={isUploading}
                  />
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </label>
              </div>
              {getImageUrl(data) && (
                 <div className="mt-4 w-full h-40 rounded-3xl overflow-hidden border border-white/10 bg-black group relative">
                    <img src={getImageUrl(data)} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={24} className="text-white" />
                    </div>
                 </div>
              )}
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Ученик / Клиент</span>
                <input 
                  type="text" 
                  value={data.student_name || ''}
                  onChange={(e) => setData({ ...data, student_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                  placeholder="Имя Фамилия"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Результат (Метрика)</span>
                <input 
                  type="text" 
                  value={data.metrics || ''}
                  onChange={(e) => setData({ ...data, metrics: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                  placeholder="+3.5М прибыли"
                />
              </div>
            </div>

            {/* Main Header */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Заголовок (Header)</span>
              <input 
                type="text" 
                value={data.header || ''}
                onChange={(e) => setData({ ...data, header: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                placeholder="+55 000 ₽ за 14 дней"
              />
            </div>

            {/* Sphere & Niche */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Сфера (напр. Фотограф)</span>
                <input 
                  type="text" 
                  value={data.sphere || ''}
                  onChange={(e) => setData({ ...data, sphere: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                  placeholder="Фотограф"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Ниша (напр. Услуги)</span>
                <input 
                  type="text" 
                  value={data.niche || ''}
                  onChange={(e) => setData({ ...data, niche: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                  placeholder="Услуги"
                />
              </div>
            </div>

            {/* Case Number Info */}
            {data.case_number && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Системный номер</span>
                <span className="text-brand-emerald font-black text-xs">Кейс №{data.case_number}</span>
              </div>
            )}

            {/* Short Essence */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Краткая суть (Sub)</span>
              <textarea 
                value={data.sub || ''}
                onChange={(e) => setData({ ...data, sub: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 h-20 resize-none"
                placeholder="Как выйти из ловушки низкого чека..."
              />
            </div>

            {/* Detailed Info */}
            <div className="space-y-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Проблема</span>
                    <textarea 
                        value={data.problem || ''}
                        onChange={(e) => setData({ ...data, problem: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 h-24 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Что сделано (Action)</span>
                    <textarea 
                        value={data.action || ''}
                        onChange={(e) => setData({ ...data, action: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 h-24 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Механика</span>
                    <textarea 
                        value={data.mechanics || ''}
                        onChange={(e) => setData({ ...data, mechanics: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 h-24 resize-none"
                        placeholder="Специфическая механика реализации..."
                    />
                </div>

                <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Финальный результат (Description)</span>
                    <textarea 
                        value={data.description || ''}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 h-28 resize-none"
                    />
                </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
          <button 
            onClick={() => onSave(data)}
            className="flex-1 py-4 bg-[#00FFC2] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            Сохранить изменения
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
