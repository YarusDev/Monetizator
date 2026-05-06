import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Briefcase, X, Settings2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Новые модульные компоненты
import { StatsHeader } from '../../components/admin/crm/StatsHeader';
import { KanbanBoard } from '../../components/admin/crm/KanbanBoard';
import { ClientManager } from '../../components/admin/crm/ClientManager';
import { FinanceManager } from '../../components/admin/crm/FinanceManager';
import { TasksManager } from '../../components/admin/crm/TasksManager';
import { ProductManager } from '../../components/admin/crm/ProductManager';
import { 
  CreateDealModal, 
  TaskModal, 
  ClientDetailModal, 
  NewLeadModal, 
  LeadEditModal, 
  NewClientModal,
  EditStageModal
} from '../../components/admin/crm/Modals/CRMModals';

// Типы
import type { Lead, Client, Deal, Stage, Task } from '../../components/admin/crm/types';

const LeadManagementPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'leads' | 'clients' | 'settings' | 'deals' | 'tasks' | 'products'>('leads');
  const [clientActiveTab, setClientActiveTab] = useState<'cards' | 'list' | 'kanban'>('cards');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | null>(null);
  const [selectedStageForEdit, setSelectedStageForEdit] = useState<Stage | null>(null);
  const [pendingWonLead, setPendingWonLead] = useState<Lead | null>(null);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: stageData } = await supabase.from('m_funnel_stages').select('*').order('order_index', { ascending: true });
    if (stageData) setStages(stageData);

    const { data: leadData } = await supabase.from('m_leads').select('*').order('created_at', { ascending: false });
    if (leadData) setLeads(leadData);

    const { data: clientData } = await supabase.from('m_clients').select('*').order('created_at', { ascending: false });
    if (clientData) setClients(clientData);

    const { data: dealData } = await supabase.from('m_deals').select('*').order('created_at', { ascending: false });
    if (dealData) setDeals(dealData);

    const { data: taskData } = await supabase.from('m_tasks').select('*').order('due_date', { ascending: true });
    if (taskData) setTasks(taskData);

    const { data: prodData } = await supabase.from('m_products').select('*').order('order_index', { ascending: true });
    if (prodData) setProducts(prodData);
    
    setLoading(false);
  };

  const filteredLeads = useMemo(() => leads.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase())), [leads, searchQuery]);
  const filteredClients = useMemo(() => clients.filter(c => c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())), [clients, searchQuery]);
  const filteredTasks = useMemo(() => tasks.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase())), [tasks, searchQuery]);


  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const leadId = active.id;
    const overId = over.id;
    
    const targetStage = stages.find(s => s.key === overId);
    if (targetStage) {
       if (targetStage.key === 'won') {
          const lead = leads.find(l => l.id === leadId);
          if (lead) setPendingWonLead(lead);
       } else {
          updateLeadStatus(leadId, targetStage.key);
       }
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase.from('m_leads').update({ status: newStatus }).eq('id', leadId);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    }
  };

  const handleSaveDeal = async (dealData: any) => {
    const lead = leads.find(l => l.id === dealData.lead_id);
    if (!lead) return;

    let clientId = '';
    const { data: existing } = await supabase.from('m_clients').select('id').eq('email', lead.contact).single();
    if (existing) {
       clientId = existing.id;
    } else {
       const { data: nc } = await supabase.from('m_clients').insert([{ full_name: lead.name, email: lead.contact, type: 'person' }]).select().single();
       if (nc) clientId = nc.id;
    }

    const isRepeat = deals.some(d => d.client_id === clientId);
    await supabase.from('m_deals').insert([{ ...dealData, client_id: clientId, is_repeat: isRepeat }]);
    
    updateLeadStatus(dealData.lead_id, 'won');
    setPendingWonLead(null);
    fetchInitialData();
  };

  const handleSaveTask = async (taskData: any) => {
    const { error } = await supabase.from('m_tasks').insert([taskData]);
    if (!error) {
       setIsTaskModalOpen(false);
       fetchInitialData();
    }
  };

  const handleCreateLead = async (data: { name: string, contact: string }) => {
    const { error } = await supabase.from('m_leads').insert([{ ...data, status: 'new' }]);
    if (!error) {
       setIsNewLeadModalOpen(false);
       fetchInitialData();
    }
  };

  const handleUpdateLead = async (data: Lead) => {
    const { error } = await supabase.from('m_leads').update({ 
      name: data.name, 
      contact: data.contact, 
      status: data.status,
      note: data.note
    }).eq('id', data.id);
    if (!error) {
       setSelectedLeadForEdit(null);
       fetchInitialData();
    }
  };

  const handleCreateClient = async (data: { full_name: string, type: 'person' | 'company' }) => {
    const { error } = await supabase.from('m_clients').insert([data]);
    if (!error) {
       setIsNewClientModalOpen(false);
       fetchInitialData();
    }
  };

  const handleUpdateStage = async (stage: Stage) => {
    const { error } = await supabase.from('m_funnel_stages').update({ title: stage.title, color: stage.color }).eq('id', stage.id);
    if (!error) {
       setSelectedStageForEdit(null);
       fetchInitialData();
    }
  };

  const handleAddStage = async () => {
    const newOrder = stages.length;
    const { error } = await supabase.from('m_funnel_stages').insert([{ title: 'Новый этап', key: `stage_${Date.now()}`, order_index: newOrder, color: 'bg-blue-500' }]);
    if (!error) fetchInitialData();
  };

  const handleMoveStage = async (stageId: string, direction: 'up' | 'down') => {
     const idx = stages.findIndex(s => s.id === stageId);
     if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === stages.length - 1)) return;
     
     const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
     const currentStage = stages[idx];
     const targetStage = stages[targetIdx];
     
     await supabase.from('m_funnel_stages').update({ order_index: targetStage.order_index }).eq('id', currentStage.id);
     await supabase.from('m_funnel_stages').update({ order_index: currentStage.order_index }).eq('id', targetStage.id);
     
     fetchInitialData();
  };

  const handleGlobalCreate = () => {
     if (activeView === 'leads') setIsNewLeadModalOpen(true);
     else if (activeView === 'clients') setIsNewClientModalOpen(true);
     else if (activeView === 'tasks') setIsTaskModalOpen(true);
  };

  return (
    <div className="admin-platform-crm h-full">
      {/* Модалки */}
      <CreateDealModal isOpen={!!pendingWonLead} onClose={() => setPendingWonLead(null)} onSave={handleSaveDeal} lead={pendingWonLead} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} clients={clients} />
      <ClientDetailModal client={selectedClient} isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} onSave={() => fetchInitialData()} leads={leads} deals={deals} tasks={tasks} />
      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} onSave={handleCreateLead} />
      <LeadEditModal isOpen={!!selectedLeadForEdit} onClose={() => setSelectedLeadForEdit(null)} onSave={handleUpdateLead} lead={selectedLeadForEdit} stages={stages} />
      <NewClientModal isOpen={isNewClientModalOpen} onClose={() => setIsNewClientModalOpen(false)} onSave={handleCreateClient} />
      <EditStageModal isOpen={!!selectedStageForEdit} onClose={() => setSelectedStageForEdit(null)} onSave={handleUpdateStage} stage={selectedStageForEdit} />
      
      {/* Хедер управления */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4">
            {activeView === 'leads' ? 'Заявки' : activeView === 'clients' ? 'База Клиентов' : activeView === 'deals' ? 'Финансы' : activeView === 'tasks' ? 'Задачи' : 'Настройка'}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] shadow-[0_0_8px_#00FFC2]"></div>
             Neural CRM Matrix v2.6
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass flex p-1 rounded-2xl bg-white/[0.02]">
            {['leads', 'clients', 'deals', 'tasks', 'products', 'settings'].map((v: any) => (
              <button 
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeView === v ? 'bg-[#00FFC2] text-black shadow-[0_10px_30px_rgba(0,255,194,0.3)]' : 'text-slate-500 hover:text-white'}`}
              >
                {v === 'leads' ? 'Заявки' : v === 'clients' ? 'Клиенты' : v === 'deals' ? 'Сделки' : v === 'tasks' ? 'Задачи' : v === 'products' ? 'Продукты' : 'Воронка'}
                {v === 'leads' && leads.filter(l => l.status === 'new').length > 0 && (
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>
            ))}
          </div>
          <button onClick={handleGlobalCreate} className="admin-button-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 h-[46px] shadow-[0_15px_30px_rgba(0,255,194,0.2)]">
            <Plus size={18} /> Создать
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40 animate-pulse"><div className="w-16 h-16 border-b-2 border-[#00FFC2] rounded-full animate-spin"></div></div>
      ) : (
        <>
          {activeView === 'leads' && (
            <>
              <StatsHeader stages={stages} leads={leads} />
              <div className="mb-6 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Briefcase size={14} className="text-[#00FFC2]" /> Всего: <span className="text-white ml-2">{filteredLeads.length}</span>
                 </div>
              </div>
              <KanbanBoard 
                stages={stages} 
                leads={filteredLeads} 
                tasks={tasks}
                onDragEnd={handleDragEnd} 
                onConvert={setPendingWonLead} 
                onEdit={setSelectedLeadForEdit}
                onSettings={() => setActiveView('settings')}
              />
            </>
          )}

          {activeView === 'clients' && (
            <ClientManager 
              clients={filteredClients} 
              leads={leads} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              activeTab={clientActiveTab} 
              setActiveTab={setClientActiveTab} 
              onClientClick={setSelectedClient}
            />
          )}

          {activeView === 'tasks' && (
            <TasksManager 
              tasks={filteredTasks} 
              onAddTask={() => setIsTaskModalOpen(true)} 
              clients={clients} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          )}

          {activeView === 'products' && (
            <ProductManager products={products} onUpdate={fetchInitialData} />
          )}

          {activeView === 'deals' && (
            <FinanceManager deals={deals} clients={clients} />
          )}

          {activeView === 'settings' && (
             <div className="max-w-4xl mx-auto glass p-12 rounded-[4rem] animate-in zoom-in-95 duration-500 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-3xl font-black tracking-tighter">Настройка воронки</h2>
                   <div className="flex gap-4">
                      <button onClick={handleAddStage} className="admin-button-primary px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 rounded-2xl">
                         <Plus size={18} /> Добавить этап
                      </button>
                      <button onClick={() => setActiveView('leads')} className="p-4 hover:bg-white/5 rounded-full"><X size={32} /></button>
                   </div>
                </div>
                <div className="space-y-4">
                   {stages.map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#00FFC2]/30 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                               <button onClick={() => handleMoveStage(s.id, 'up')} className={`text-slate-700 hover:text-white transition-all ${idx === 0 ? 'opacity-0 cursor-default' : ''}`}><ArrowUp size={16} /></button>
                               <button onClick={() => handleMoveStage(s.id, 'down')} className={`text-slate-700 hover:text-white transition-all ${idx === stages.length - 1 ? 'opacity-0 cursor-default' : ''}`}><ArrowDown size={16} /></button>
                            </div>
                            <div className={`w-4 h-4 rounded-full ${s.color}`}></div>
                            <div className="font-black text-xl text-white">{s.title}</div>
                         </div>
                         <button onClick={() => setSelectedStageForEdit(s)} className="p-3 bg-white/5 rounded-2xl text-slate-600 hover:text-white transition-all"><Settings2 size={24} /></button>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadManagementPage;
