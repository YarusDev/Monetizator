import { useState } from 'react';
import { Layout, X, ChevronRight } from 'lucide-react';
import { IconSelector } from '../IconSelector';
import { ProductModal } from './ProductModal';
import { supabase } from '../../../../lib/supabase';

interface ContentFieldEditorProps {
  value: any;
  onChange: (v: any) => void;
  label: string;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const ContentFieldEditor = ({ value, onChange, label, onUpload, isUploading }: ContentFieldEditorProps) => {
  const isEchelonField = label === 'echelons';
  const isArrayField = Array.isArray(value) || ['questions', 'cases', 'steps', 'items', 'menu_items', 'contacts'].includes(label);
  const cmsBlocks = (window as any).cms_blocks || [];
  const anchorKeys = cmsBlocks.map((b: any) => b.block_key);

  const [activeEditingProduct, setActiveEditingProduct] = useState<{ echelonIdx?: number; productIdx: number; data: any } | null>(null);

  const [allCatalogProducts, setAllCatalogProducts] = useState<any[]>([]);
  const [showCatalogSelector, setShowCatalogSelector] = useState<{ echelonIdx: number } | null>(null);

  const fetchCatalog = async () => {
    const { data } = await supabase.from('m_products').select('*').eq('is_active', true);
    if (data) setAllCatalogProducts(data);
  };

  const handleProductSave = (productData: any) => {
    if (!activeEditingProduct) return;
    const newArr = [...value];
    if (activeEditingProduct.echelonIdx !== undefined) {
      const newEchelon = { ...value[activeEditingProduct.echelonIdx] };
      newEchelon.products = [...(newEchelon.products || [])];
      newEchelon.products[activeEditingProduct.productIdx] = productData;
      newArr[activeEditingProduct.echelonIdx] = newEchelon;
    } else {
      newArr[activeEditingProduct.productIdx] = productData;
    }
    onChange(newArr);
    setActiveEditingProduct(null);
  };

  if (isEchelonField) {
    return (
      <div className="space-y-6">
        <label className="text-[10px] text-[#00FFC2] font-black uppercase tracking-widest flex justify-between items-center">
          Эшелоны продуктов
          <button 
            onClick={() => {
              const newItem = { title: 'Эшелон 1: Новый уровень', description: 'Описание уровня...', products: [] };
              onChange([...(value || []), newItem]);
            }}
            className="px-3 py-1 bg-[#00FFC2]/10 text-[#00FFC2] rounded-lg text-[9px] hover:bg-[#00FFC2]/20 transition-all"
          >
            + Добавить Эшелон
          </button>
        </label>
        
        <div className="space-y-8">
          {(value || []).map((echelon: any, eIdx: number) => (
            <div key={eIdx} className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-[#10B981] text-black rounded-full text-[8px] font-black uppercase tracking-widest">
                Эшелон {eIdx + 1}
              </div>
              <button 
                onClick={() => onChange(value.filter((_: any, i: number) => i !== eIdx))}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-all z-10"
              >
                <X size={14} />
              </button>
              
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Заголовок уровня</span>
                    <input 
                      type="text" 
                      value={echelon.title || ''}
                      onChange={(e) => {
                        const newArr = [...value];
                        newArr[eIdx] = { ...echelon, title: e.target.value };
                        onChange(newArr);
                      }}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-white text-[11px] outline-none focus:border-[#00FFC2]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Описание уровня</span>
                    <textarea 
                      value={echelon.description || ''}
                      onChange={(e) => {
                        const newArr = [...value];
                        newArr[eIdx] = { ...echelon, description: e.target.value };
                        onChange(newArr);
                      }}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-white text-[11px] outline-none focus:border-[#00FFC2]/20 h-20 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] text-[#00FFC2] uppercase font-black tracking-widest">Товары этого уровня</span>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            fetchCatalog();
                            setShowCatalogSelector({ echelonIdx: eIdx });
                          }}
                          className="text-[9px] text-brand-gold hover:text-white uppercase font-black transition-colors"
                        >
                          + Из каталога
                        </button>
                        <button 
                          onClick={() => {
                             const newProduct = { title: 'Новый продукт', price: 0, image: '', description: '' };
                             const newArr = [...value];
                             newArr[eIdx] = { ...echelon, products: [...(echelon.products || []), newProduct] };
                             onChange(newArr);
                          }}
                          className="text-[9px] text-slate-500 hover:text-white uppercase font-bold transition-colors"
                        >
                          + Создать новый
                        </button>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-3">
                      {(echelon.products || []).map((product: any, pIdx: number) => {
                        const productImg = product.image || product.image_url || '';
                        const displayImg = productImg.startsWith('assets/') ? `/${productImg}` : productImg;
                        return (
                          <div key={pIdx} className="group p-3 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
                             <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                {productImg ? <img src={displayImg} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><Layout size={16} /></div>}
                             </div>
                             <div className="flex-grow">
                                <div className="text-[10px] font-black text-white uppercase truncate">{product.title}</div>
                                <div className="text-[9px] text-brand-emerald font-mono">{product.price || 0} ₽</div>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => setActiveEditingProduct({ echelonIdx: eIdx, productIdx: pIdx, data: product })} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"><ChevronRight size={14} /></button>
                                <button onClick={() => {
                                     const newArr = [...value];
                                     newArr[eIdx] = { ...echelon, products: echelon.products.filter((_: any, i: number) => i !== pIdx) };
                                     onChange(newArr);
                                }} className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all"><X size={12} /></button>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCatalogSelector && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Выбрать из каталога</h3>
                <button onClick={() => setShowCatalogSelector(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-4">
                {allCatalogProducts.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => {
                      const newArr = [...value];
                      const eIdx = showCatalogSelector.echelonIdx;
                      const echelon = value[eIdx];
                      newArr[eIdx] = { ...echelon, products: [...(echelon.products || []), { ...p, image: p.image_url }] };
                      onChange(newArr);
                      setShowCatalogSelector(null);
                    }}
                    className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#00FFC2]/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5">
                        {p.image_url && <img src={p.image_url} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div className="flex-grow">
                        <div className="text-[10px] font-black text-white uppercase group-hover:text-[#00FFC2] transition-colors">{p.title}</div>
                        <div className="text-[9px] text-slate-500">{p.price} ₽</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeEditingProduct && (
          <ProductModal 
            initialData={activeEditingProduct.data} 
            onClose={() => setActiveEditingProduct(null)} 
            onSave={handleProductSave} 
            onUpload={onUpload} 
          />
        )}
      </div>
    );
  }

  if (isArrayField) {
    return (
      <div className="space-y-3">
        <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest flex justify-between items-center">
          {label}
          <button 
            onClick={() => {
              let newItem: any = '';
              if (label === 'menu_items') newItem = { label: 'Новый пункт', id: '' };
              else if (label === 'contacts') newItem = { label: 'Новый контакт', value: '', link: '', icon: 'MessageCircle' };
              else if (label === 'products' || label === 'items') newItem = { title: 'Новый продукт', price: 0, currency: 'RUB', description: '', image: '' };
              else if (value.length > 0 && typeof value[0] === 'object') newItem = Object.keys(value[0]).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
              onChange([...value, newItem]);
            }}
            className="text-[#00FFC2] hover:underline"
          >
            + Добавить
          </button>
        </label>
        <div className="space-y-2">
          {(value || []).map((item: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
              <button onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))} className="absolute top-2 right-2 w-6 h-6 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-all z-10"><X size={12} /></button>
              {typeof item === 'object' ? (
                (label === 'products' || label === 'items') ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      {(item.image || item.image_url) ? <img src={(item.image || item.image_url).startsWith('assets/') ? `/${item.image || item.image_url}` : (item.image || item.image_url)} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><Layout size={16} /></div>}
                    </div>
                    <div className="flex-grow">
                      <div className="text-[10px] font-black text-white uppercase truncate">{item.title}</div>
                      <div className="text-[9px] text-brand-emerald font-mono">{item.price || 0} {item.currency || '₽'}</div>
                    </div>
                    <button onClick={() => setActiveEditingProduct({ productIdx: idx, data: item })} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"><ChevronRight size={14} /></button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.keys(item).map(k => (
                      <div key={k} className="flex flex-col gap-1.5">
                        <span className="text-[8px] text-slate-700 uppercase font-bold tracking-widest">{k}</span>
                        {k.toLowerCase().includes('icon') ? (
                          <div className="flex gap-4 items-center bg-black/20 p-2 rounded-xl"><IconSelector value={item[k]} onChange={(val: string) => { const newArr = [...(value || [])]; newArr[idx] = { ...item, [k]: val }; onChange(newArr); }} /><div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Выбрать иконку</div></div>
                        ) : k.toLowerCase().includes('image') ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input type="text" value={item[k] || ''} onChange={(e) => { const newArr = [...(value || [])]; newArr[idx] = { ...item, [k]: e.target.value }; onChange(newArr); }} className="flex-grow bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-white text-[10px] outline-none focus:border-[#00FFC2]/20" />
                              {onUpload && <label className="flex items-center justify-center px-4 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all"><input type="file" className="hidden" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await onUpload(file, k); if (url) { const newArr = [...(value || [])]; newArr[idx] = { ...item, [k]: url }; onChange(newArr); } } }} disabled={isUploading} /><span className="text-[9px] font-black uppercase tracking-widest">{isUploading ? '...' : 'UP'}</span></label>}
                            </div>
                            {item[k] && <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10"><img src={item[k].startsWith('assets/') ? `/${item[k]}` : item[k]} className="w-full h-full object-cover" alt="Preview" /></div>}
                          </div>
                        ) : (k.toLowerCase().includes('id') || k.toLowerCase().includes('anchor')) ? (
                          <select value={item[k] || ''} onChange={(e) => { const newArr = [...(value || [])]; newArr[idx] = { ...item, [k]: e.target.value }; onChange(newArr); }} className="bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-white text-[10px] outline-none focus:border-[#00FFC2]/20 appearance-none"><option value="">Выберите блок</option>{anchorKeys.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}</select>
                        ) : <input type="text" value={item[k] || ''} onChange={(e) => { const newArr = [...(value || [])]; newArr[idx] = { ...item, [k]: e.target.value }; onChange(newArr); }} className="bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-white text-[10px] outline-none focus:border-[#00FFC2]/20" />}
                      </div>
                    ))}
                  </div>
                )
              ) : <input type="text" value={item} onChange={(e) => { const newArr = [...(value || [])]; newArr[idx] = e.target.value; onChange(newArr); }} className="w-full bg-transparent text-white text-[10px] outline-none" />}
            </div>
          ))}
        </div>
        {activeEditingProduct && <ProductModal initialData={activeEditingProduct.data} onClose={() => setActiveEditingProduct(null)} onSave={handleProductSave} onUpload={onUpload} />}
      </div>
    );
  }

  const isStringVal = typeof value === 'string';
  const isLongText = isStringVal && value.length > 50;
  const isIconField = label.toLowerCase().includes('icon');
  const isImageField = label.toLowerCase().includes('image');
  const isAnchorField = label.toLowerCase().includes('id') || label.toLowerCase().includes('anchor');

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{label}</label>
      {isIconField ? <IconSelector value={value} onChange={onChange} /> : 
       isAnchorField ? <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2 text-white text-[10px] outline-none focus:border-[#00FFC2]/30 appearance-none"><option value="">Выберите блок</option>{anchorKeys.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}</select> :
       isLongText ? <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] outline-none focus:border-[#00FFC2]/30 resize-none h-24" /> :
       <div className="space-y-3">
         <div className="flex gap-2">
           <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="flex-grow bg-black/60 border border-white/5 rounded-xl px-4 py-2 text-white text-[10px] outline-none focus:border-[#00FFC2]/30" />
           {isImageField && onUpload && <label className="flex items-center justify-center px-4 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all"><input type="file" className="hidden" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await onUpload(file, label); if (url) onChange(url); } }} disabled={isUploading} /><span className="text-[9px] font-black uppercase tracking-widest">{isUploading ? '...' : 'UP'}</span></label>}
         </div>
         {isImageField && value && <div className="w-full h-32 rounded-2xl overflow-hidden border border-white/10 bg-black/60 group/preview relative"><img src={value.startsWith('assets/') ? `/${value}` : value} className="w-full h-full object-contain" alt="Preview" /><div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-all"><span className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Image Preview</span></div></div>}
       </div>}
    </div>
  );
};
