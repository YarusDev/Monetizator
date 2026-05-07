import { useState } from 'react';
import { Package, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ProductModal } from './matrix-editor/ProductModal';
import { sanitizeFileName } from '../../../lib/storage';

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
  const [editingProduct, setEditingProduct] = useState<Product | Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async (data: any) => {
    if (data.id) {
      await supabase.from('m_products').update(data).eq('id', data.id);
    } else {
      await supabase.from('m_products').insert([data]);
    }
    setEditingProduct(null);
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
      return null;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <Package className="text-amber-500" /> Каталог Продуктов
        </h2>
        <button 
          onClick={() => setEditingProduct({ title: '', price: 0, currency: 'RUB', description: '', is_active: true })}
          className="admin-button-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3"
        >
          <Plus size={16} /> Новый продукт
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="glass p-6 rounded-[2.5rem] bg-white/[0.02] border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingProduct(product)} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-[#00FFC2] transition-colors border border-white/10"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(product.id)} className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-red-500 transition-colors border border-white/10"><Trash2 size={16} /></button>
            </div>

            <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden bg-white/5 border-b border-white/5">
              {product.image_url ? (
                <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700">
                  <Package size={48} />
                </div>
              )}
            </div>

            <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#00FFC2] transition-colors line-truncate">{product.title}</h3>
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

      {products.length === 0 && !editingProduct && (
        <div className="py-40 text-center glass rounded-[3rem]">
          <div className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">Каталог пуст</div>
          <p className="text-slate-700 text-[10px] mt-2">Добавьте свой первый продукт для CRM</p>
        </div>
      )}

      {editingProduct && (
        <ProductModal 
          initialData={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};
