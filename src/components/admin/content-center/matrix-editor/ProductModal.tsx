import { useState } from 'react';
import { X } from 'lucide-react';

interface ProductModalProps {
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => void;
  onUpload?: (file: File, path: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const ProductModal = ({ initialData, onClose, onSave, onUpload, isUploading }: ProductModalProps) => {
  const [data, setData] = useState(JSON.parse(JSON.stringify(initialData)));

  const getImageUrl = (d: any) => {
    const img = d.image || d.image_url || '';
    if (!img) return '';
    return img.startsWith('assets/') ? `/${img}` : img;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Редактировать продукт</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Название</span>
              <input 
                type="text" 
                value={data.title || ''}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Цена</span>
                <input 
                  type="number" 
                  value={data.price || 0}
                  onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Валюта</span>
                <select 
                  value={data.currency || 'RUB'}
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                >
                  <option value="RUB">RUB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Изображение (URL)</span>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={data.image_url || data.image || ''}
                  onChange={(e) => setData({ ...data, image_url: e.target.value })}
                  className="flex-grow bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30"
                  placeholder="URL изображения..."
                />
                <label className="px-6 rounded-2xl bg-[#00FFC2] text-black font-black text-[9px] uppercase tracking-widest flex items-center justify-center cursor-pointer hover:scale-105 transition-all">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={async (e) => {
                       const file = e.target.files?.[0];
                       if (file && onUpload) {
                         const url = await onUpload(file, 'product');
                         if (url) setData({ ...data, image_url: url });
                       }
                    }}
                  />
                  Загрузить
                  {isUploading && (
                    <div className="absolute inset-0 bg-[#00FFC2] flex items-center justify-center rounded-2xl">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    </div>
                  )}
                </label>
              </div>
              {getImageUrl(data) && (
                 <div className="mt-4 w-full h-48 rounded-3xl overflow-hidden border border-white/10 bg-black">
                    <img src={getImageUrl(data)} className="w-full h-full object-cover" alt="" />
                 </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Описание</span>
              <textarea 
                value={data.description || ''}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs outline-none focus:border-[#00FFC2]/30 h-32 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => onSave(data)}
              className="flex-1 py-4 bg-[#00FFC2] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
            >
              Сохранить изменения
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
