import { useState } from 'react';
import { Layout, Package, X, ArrowUp, ArrowDown, Edit2, PlusCircle } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader, AddButton, DeleteButton } from './BaseFields';
import { ProductModal } from '../ProductModal';
import { supabase } from '../../../../../lib/supabase';

interface ServicesSettingsProps {
  block: any;
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const ServicesSettings = ({ block, onChange, onUpload, isUploading }: ServicesSettingsProps) => {
  const content = block.content || {};
  
  // Provide defaults if echelons don't exist yet
  const echelons = content.echelons || [];
  
  const [activeEditingProduct, setActiveEditingProduct] = useState<{ echelonIdx?: number; productIdx: number | 'new'; data: any } | null>(null);
  const [allCatalogProducts, setAllCatalogProducts] = useState<any[]>([]);
  const [showCatalogSelector, setShowCatalogSelector] = useState<{ echelonIdx: number } | null>(null);

  useState(() => {
    const init = async () => {
      const { data } = await supabase.from('m_products').select('*').eq('is_active', true);
      if (data) setAllCatalogProducts(data);
    };
    init();
  });

  const fetchCatalog = async () => {
    const { data } = await supabase.from('m_products').select('*').eq('is_active', true);
    if (data) setAllCatalogProducts(data);
  };

  const getHydratedProduct = (p: any) => {
    const pTitle = (p.title || '').trim().toLowerCase();
    const dbP = allCatalogProducts.find(item => {
      if (p.id && item.id === p.id) return true;
      const dbTitle = (item.title || '').trim().toLowerCase();
      return dbTitle === pTitle || dbTitle.includes(pTitle) || pTitle.includes(dbTitle);
    });
    
    if (!dbP) return p;
    return {
      ...p,
      id: dbP.id,
      image_url: dbP.image_url || p.image_url,
      description: p.description || dbP.description,
      price: p.price || dbP.price,
      currency: p.currency || dbP.currency
    };
  };

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleEchelonUpdate = (idx: number, field: string | any, val?: any) => {
    const newEchelons = [...echelons];
    if (typeof field === 'string') {
      newEchelons[idx] = { ...newEchelons[idx], [field]: val };
    } else {
      newEchelons[idx] = field;
    }
    handleUpdate('echelons', newEchelons);
  };

  const reorderProduct = (eIdx: number, pIdx: number, direction: 'up' | 'down') => {
    const newEchelons = [...echelons];
    const echelon = { ...newEchelons[eIdx] };
    const products = [...(echelon.products || [])];
    
    const newPIdx = direction === 'up' ? pIdx - 1 : pIdx + 1;
    if (newPIdx < 0 || newPIdx >= products.length) return;
    
    [products[pIdx], products[newPIdx]] = [products[newPIdx], products[pIdx]];
    echelon.products = products;
    newEchelons[eIdx] = echelon;
    handleUpdate('echelons', newEchelons);
  };

  const handleProductSave = (productData: any) => {
    if (!activeEditingProduct) return;
    const newEchelons = [...echelons];
    const eIdx = activeEditingProduct.echelonIdx!;
    const pIdx = activeEditingProduct.productIdx;
    
    const echelon = { ...newEchelons[eIdx] };
    echelon.products = [...(echelon.products || [])];
    
    if (pIdx === 'new') {
      echelon.products.push(productData);
    } else {
      echelon.products[pIdx] = productData;
    }
    
    newEchelons[eIdx] = echelon;
    handleUpdate('echelons', newEchelons);
    setActiveEditingProduct(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Линейка продуктов" 
        subtitle="Управление категориями и товарным наполнением"
        icon={Layout}
      />

      <div className="space-y-6">
        <TextField label="Заголовок блока" value={content.title} onChange={(v) => handleUpdate('title', v)} />
        <TextAreaField label="Подзаголовок" value={content.subtitle} onChange={(v) => handleUpdate('subtitle', v)} />
      </div>

      <div className="space-y-12 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Категории продуктов</h4>
          <AddButton 
            onClick={() => handleUpdate('echelons', [...echelons, { title: `Новая категория ${echelons.length + 1}`, description: '', products: [] }])}
            label="Добавить категорию"
          />
        </div>
        
        <div className="space-y-8">
          {echelons.map((echelon: any, eIdx: number) => (
            <div key={eIdx} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 relative group">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <DeleteButton onClick={() => handleUpdate('echelons', echelons.filter((_: any, i: number) => i !== eIdx))} />
              </div>

              <div className="flex items-start gap-4 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald shrink-0 mt-2">
                  <span className="text-xs font-black">{eIdx + 1}</span>
                </div>
                <div className="flex-grow space-y-4">
                  <TextField 
                    label="Название категории" 
                    value={echelon.title} 
                    onChange={(v) => handleEchelonUpdate(eIdx, 'title', v)} 
                  />
                  <TextAreaField 
                    label="Описание категории (для чего она)" 
                    value={echelon.description} 
                    onChange={(v) => handleEchelonUpdate(eIdx, 'description', v)} 
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <h5 className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Товары в этой категории</h5>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setActiveEditingProduct({ echelonIdx: eIdx, productIdx: 'new', data: { title: '', price: '', currency: 'RUB', description: '', is_active: true } })}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl emerald-gradient text-white hover:scale-105 active:scale-95 transition-all text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-emerald/20"
                    >
                      <PlusCircle size={12} />
                      Новый продукт
                    </button>
                    <button 
                      onClick={() => { fetchCatalog(); setShowCatalogSelector({ echelonIdx: eIdx }); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-widest border border-white/10"
                    >
                      <Package size={12} />
                      Из каталога
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(echelon.products || []).map((p: any, pIdx: number) => {
                    const hydratedP = getHydratedProduct(p);
                    return (
                      <div key={hydratedP.id || pIdx} className="group/item p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-brand-emerald/20 transition-all flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden shrink-0 border border-white/5">
                          {(hydratedP.image_url || hydratedP.image) ? (
                            <img src={hydratedP.image_url || hydratedP.image} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <div className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{hydratedP.title}</div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-brand-emerald font-mono font-bold">{hydratedP.price} {hydratedP.currency || '₽'}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter">ID: {hydratedP.id?.slice(0, 8) || 'local'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                          <div className="flex flex-col gap-1 mr-2 border-r border-white/5 pr-2">
                            <button 
                              onClick={() => reorderProduct(eIdx, pIdx, 'up')}
                              disabled={pIdx === 0}
                              className="p-1.5 text-slate-600 hover:text-brand-emerald disabled:opacity-0 transition-all"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              onClick={() => reorderProduct(eIdx, pIdx, 'down')}
                              disabled={pIdx === (echelon.products?.length || 0) - 1}
                              className="p-1.5 text-slate-600 hover:text-brand-emerald disabled:opacity-0 transition-all"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => setActiveEditingProduct({ echelonIdx: eIdx, productIdx: pIdx, data: hydratedP })}
                            className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald hover:text-white border border-brand-emerald/20 transition-all flex items-center justify-center"
                            title="Редактировать"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Удалить продукт из этой категории?')) {
                                const products = echelon.products.filter((_: any, i: number) => i !== pIdx);
                                handleEchelonUpdate(eIdx, 'products', products);
                              }
                            }}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500/40 hover:text-white hover:bg-red-500 transition-all flex items-center justify-center"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCatalogSelector && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-brand-obsidian border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Выбрать из каталога</h3>
              <button onClick={() => setShowCatalogSelector(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-4">
              {allCatalogProducts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => {
                    const eIdx = showCatalogSelector.echelonIdx;
                    const echelon = echelons[eIdx];
                    handleEchelonUpdate(eIdx, { ...echelon, products: [...(echelon.products || []), { ...p, image: p.image_url }] });
                    setShowCatalogSelector(null);
                  }}
                  className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-emerald/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5">
                      {p.image_url && <img src={p.image_url} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div className="flex-grow">
                      <div className="text-[10px] font-black text-white uppercase group-hover:text-brand-emerald transition-colors">{p.title}</div>
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
          isUploading={isUploading}
        />
      )}
    </div>
  );
};
