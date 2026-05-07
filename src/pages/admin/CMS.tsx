import { useState, useEffect } from 'react';
import { Database, Send } from 'lucide-react';
import { ProductManager } from '../../components/admin/content-center/ProductManager';
import { CaseManager } from '../../components/admin/content-center/CaseManager';
import { ContactManager } from '../../components/admin/content-center/ContactManager';
import { MatrixEditor } from '../../components/admin/content-center/MatrixEditor';
import { supabase } from '../../lib/supabase';

const CMSPage = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'cases' | 'contacts' | 'blocks'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: prodData } = await supabase.from('m_products').select('*').order('order_index', { ascending: true });
    if (prodData) setProducts(prodData);

    const { data: caseData } = await supabase
      .from('m_cases')
      .select('*')
      .order('case_number', { ascending: true });
    
    if (caseData) setCases(caseData);

    const { data: contactData } = await supabase.from('m_contacts').select('*').order('order_index', { ascending: true });
    if (contactData) setContacts(contactData);

    const { data: blockData } = await supabase.from('m_content_blocks').select('*').order('order_index', { ascending: true });
    if (blockData) setBlocks(blockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header CMS */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 glass border-white/5 ${activeTab === 'blocks' ? 'p-4 rounded-3xl' : 'p-8 rounded-[3rem]'}`}>
        <div>
          <div className="flex items-center gap-3 text-[#00FFC2] mb-2">
            <Database size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Content Management System</span>
          </div>
          <h1 className={`${activeTab === 'blocks' ? 'text-2xl' : 'text-4xl'} font-black text-white uppercase tracking-tighter transition-all`}>
            Управление <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Контентом</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Продукты
          </button>
          <button 
            onClick={() => setActiveTab('cases')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cases' ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Кейсы
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'contacts' ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Мои контакты
          </button>
          <button 
            onClick={() => setActiveTab('blocks')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blocks' ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Блоки сайта
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-12 h-12 border-2 border-[#00FFC2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'products' && (
            <ProductManager products={products} onUpdate={fetchData} />
          )}

          {activeTab === 'cases' && (
            <CaseManager cases={cases} onUpdate={fetchData} />
          )}

          {activeTab === 'contacts' && (
            <ContactManager contacts={contacts} onUpdate={fetchData} />
          )}

          {activeTab === 'blocks' && (
            <MatrixEditor blocks={blocks} onUpdate={fetchData} />
          )}
        </div>
      )}
    </div>
  );
};

export default CMSPage;
