import { useState } from 'react';
import { Package, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
  image_url?: string;
  is_active: boolean;
}

export const ProductManager = ({ products, onUpdate }: { products: Product[], onUpdate: () => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    currency: 'RUB',
    description: '',
    image_url: '',
    is_active: true
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    if (editingId) {
      await supabase.from('m_products').update(formData).eq('id', editingId);
    } else {
      await supabase.from('m_products').insert([formData]);
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
    if (confirm('Удалить этот продукт?')) {
      await supabase.from('m_products').delete().eq('id', id);
      onUpdate();
    }
  };

  const startEdit = (p: Product) => {
    setFormData(p);
    setEditingId(p.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <Package className="text-amber-500" /> Каталог Продуктов
        </h2>
        <button 
          onClick={() => { setFormData({ title: '', price: 0, currency: 'RUB', description: '', is_active: true }); setEditingId(null); setIsAdding(true); }}
          className="admin-button-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3"
        >
          <Plus size={16} /> Новый продукт
        </button>
      </div>

      {isAdding && (
        <div className="glass p-8 rounded-[2.5rem] border-[#00FFC2]/20 bg-[#00FFC2]/5 mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6">{editingId ? 'Редактировать' : 'Добавить'} продукт</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Название</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-[#00FFC2]/50 transition-colors" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Цена</label>
              <div className="flex gap-2">
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="flex-grow bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-[#00FFC2]/50 transition-colors" />
                <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none">
                  <option value="RUB">RUB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Изображение</label>
              <div className="flex gap-4 items-center">
                <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="flex-grow bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-[#00FFC2]/50 transition-colors" placeholder="URL изображения или загрузите файл" />
                <label className="shrink-0 px-6 py-4 glass rounded-2xl cursor-pointer hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00FFC2]">
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={isUploading} />
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </label>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Описание</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none h-32 resize-none focus:border-[#00FFC2]/50 transition-colors" />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={handleSave} className="admin-button-primary px-10 py-4 font-black uppercase tracking-widest text-[10px]">Сохранить</button>
            <button onClick={() => setIsAdding(false)} className="px-10 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="glass p-6 rounded-[2.5rem] bg-white/[0.02] border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                <Package size={24} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(product)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-[#00FFC2] transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#00FFC2] transition-colors">{product.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-6 h-8">{product.description || 'Нет описания'}</p>
            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <div className="text-xl font-black text-[#00FFC2]">{product.price.toLocaleString()} {product.currency === 'RUB' ? '₽' : '$'}</div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${product.is_active ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-red-500/10 text-red-500'}`}>
                {product.is_active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                {product.is_active ? 'Active' : 'Hidden'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !isAdding && (
        <div className="py-40 text-center glass rounded-[3rem]">
          <div className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">Каталог пуст</div>
          <p className="text-slate-700 text-[10px] mt-2">Добавьте свой первый продукт для CRM</p>
        </div>
      )}
    </div>
  );
};
