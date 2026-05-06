import { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, User, Building2, History, Zap, Save, Briefcase, Users, Clock, MessageCircle } from 'lucide-react';
import type { Lead, Client, Deal, Stage, Task } from '../types';

// --- Сделка ---
export const CreateDealModal = ({ isOpen, onClose, onSave, lead }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, lead: Lead | null }) => {
  const [amount, setAmount] = useState('50000');
  const [product, setProduct] = useState('Основной пакет');
  const [note, setNote] = useState('');
  
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10 animate-in zoom-in-95 duration-200 shadow-[0_0_100px_rgba(0,255,194,0.1)]">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-black flex items-center gap-3"><CreditCard className="text-[#00FFC2]" /> Оформление сделки</h2>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X size={24} /></button>
        </div>
        <div className="space-y-6">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-[10px] uppercase font-black text-slate-500 mb-1">Клиент</div>
              <div className="font-bold text-white text-lg">{lead.name}</div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 block">Сумма (₽)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-xl font-black text-[#00FFC2] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 block">Продукт</label>
                <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
              </div>
           </div>
           <div>
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 block">Заметка</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white h-24 outline-none" placeholder="Детали..."></textarea>
           </div>
           <button onClick={() => onSave({ amount: Number(amount), product_name: product, note, lead_id: lead.id })} className="w-full admin-button-primary py-5 text-sm font-black uppercase tracking-widest shadow-xl">Завершить сделку</button>
        </div>
      </div>
    </div>
  );
};

// --- Задача ---
export const TaskModal = ({ isOpen, onClose, onSave, clients }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, clients: Client[] }) => {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Calendar className="text-blue-500" /> Новая задача</h2>
        <div className="space-y-6">
           <input type="text" placeholder="Что нужно сделать?" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none appearance-none cursor-pointer">
              <option value="">Привязать к клиенту...</option>
              {clients.map(c => <option key={c.id} value={c.id} className="bg-black">{c.full_name}</option>)}
           </select>
           <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           <button onClick={() => onSave({ title, client_id: clientId, due_date: dueDate })} className="w-full admin-button-primary py-5 font-black uppercase tracking-widest">Создать задачу</button>
        </div>
      </div>
    </div>
  );
};

// --- Карточка Клиента ---
export const ClientDetailModal = ({ client, isOpen, onClose, onSave, leads, deals, tasks }: { client: Client | null, isOpen: boolean, onClose: () => void, onSave: (data: any) => void, leads: Lead[], deals: Deal[], tasks: Task[] }) => {
  const [formData, setFormData] = useState<any>(null);
  
  useEffect(() => {
    if (client) setFormData({ ...client });
  }, [client]);

  if (!isOpen || !formData) return null;

  const clientLeads = leads.filter(l => l.name === client?.full_name || l.contact === client?.email || l.contact === client?.phone);
  const clientDeals = deals.filter(d => d.client_id === client?.id);
  const clientTasks = tasks.filter(t => t.client_id === client?.id);

  const historyItems = [
    ...clientDeals.map(d => ({ ...d, type: 'deal', date: d.created_at })),
    ...clientLeads.map(l => ({ ...l, type: 'lead', date: l.created_at })),
    ...clientTasks.map(t => ({ ...t, type: 'task', date: t.due_date }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass w-full max-w-5xl rounded-[4rem] p-12 relative z-10 h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
             <div className={`w-20 h-20 rounded-3xl ${formData.type === 'company' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center border border-white/5 shadow-2xl`}>
                {formData.type === 'company' ? <Building2 size={40} /> : <User size={40} />}
             </div>
             <div>
                <h2 className="text-4xl font-black tracking-tight text-white">{formData.full_name}</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#00FFC2] mt-2">Client Profile Verified</div>
             </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full text-slate-500"><X size={32} /></button>
        </div>

        <div className="grid grid-cols-12 gap-10">
           <div className="col-span-4 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] bg-white/[0.02]">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2"><User size={16} /> Контакты</h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-2 block">Тип клиента</label>
                       <div className="flex p-1 bg-white/5 rounded-2xl w-full">
                         <button onClick={() => setFormData({...formData, type: 'person'})} className={`flex-grow py-3 rounded-xl text-[10px] font-bold uppercase ${formData.type === 'person' ? 'bg-blue-500 text-white' : 'text-slate-500'}`}>Контакт</button>
                         <button onClick={() => setFormData({...formData, type: 'company'})} className={`flex-grow py-3 rounded-xl text-[10px] font-bold uppercase ${formData.type === 'company' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>Компания</button>
                       </div>
                    </div>
                    <div>
                       <label className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-2 block">Email / Telegram</label>
                       <input type="text" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
                    </div>
                 </div>
              </div>
           </div>
           <div className="col-span-8 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] bg-white/[0.02]">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2"><History size={16} /> История взаимодействия</h3>
                 <div className="space-y-4">
                    {historyItems.map((item: any, idx) => (
                       <div key={idx} className={`flex items-center justify-between p-5 rounded-3xl border ${
                          item.type === 'deal' ? 'bg-[#00FFC2]/5 border-[#00FFC2]/10' : 
                          item.type === 'task' ? 'bg-blue-500/5 border-blue-500/10' : 
                          'bg-white/5 border-white/10'
                       }`}>
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-xl ${
                                item.type === 'deal' ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 
                                item.type === 'task' ? 'bg-blue-500/10 text-blue-500' : 
                                'bg-white/10 text-white'
                             }`}>
                                {item.type === 'deal' ? <Zap size={18} /> : item.type === 'task' ? <Clock size={18} /> : <MessageCircle size={18} />}
                             </div>
                             <div>
                                <div className="text-sm font-bold text-white">
                                   {item.type === 'deal' ? `Сделка: ${item.product_name}` : 
                                    item.type === 'task' ? `Задача: ${item.title}` : 
                                    `Заявка с сайта`}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                                   {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             {item.type === 'deal' && <div className="text-lg font-black text-[#00FFC2]">{item.amount.toLocaleString()} ₽</div>}
                             {item.type === 'task' && <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${item.status === 'completed' ? 'bg-[#00FFC2]/10 text-[#00FFC2]' : 'bg-amber-500/10 text-amber-500'}`}>{item.status}</div>}
                             {item.type === 'lead' && <div className="text-[9px] font-black uppercase text-slate-500">{item.status}</div>}
                          </div>
                       </div>
                    ))}
                    {historyItems.length === 0 && (
                       <div className="py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">История пуста</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
        <div className="mt-12 flex gap-4 justify-end border-t border-white/5 pt-10">
           <button onClick={onClose} className="px-12 py-5 glass rounded-2xl text-xs font-bold uppercase tracking-widest">Закрыть</button>
           <button onClick={() => onSave(formData)} className="px-16 py-5 admin-button-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl"><Save size={20} className="mr-2 inline" /> Сохранить</button>
        </div>
      </div>
    </div>
  );
};

// --- Новая Заявка ---
export const NewLeadModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Zap className="text-[#00FFC2]" /> Новая заявка</h2>
        <div className="space-y-6">
           <input type="text" placeholder="Имя клиента" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           <input type="text" placeholder="Telegram / Телефон" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           <button onClick={() => onSave({ name, contact })} className="w-full admin-button-primary py-5 font-black uppercase tracking-widest">Добавить</button>
        </div>
      </div>
    </div>
  );
};

// --- Редактирование Лида (NEW) ---
export const LeadEditModal = ({ isOpen, onClose, onSave, lead, stages }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, lead: Lead | null, stages: Stage[] }) => {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (lead) setFormData({ ...lead });
  }, [lead]);

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Briefcase className="text-[#00FFC2]" /> Редактирование заявки</h2>
        <div className="space-y-6">
           <div>
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Имя</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           </div>
           <div>
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Контакт</label>
              <input type="text" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           </div>
           <div>
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Заметки / Комментарии</label>
              <textarea 
                value={formData.note || ''} 
                onChange={(e) => setFormData({...formData, note: e.target.value})} 
                placeholder="Добавьте важную информацию о сделке..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none min-h-[120px] resize-none" 
              />
           </div>
           <div>
              <label className="text-[10px] uppercase font-black text-slate-500 mb-2 block">Статус воронки</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none bg-black">
                 {stages.map(s => <option key={s.id} value={s.key}>{s.title}</option>)}
              </select>
           </div>
           <button onClick={() => onSave(formData)} className="w-full admin-button-primary py-5 font-black uppercase tracking-widest">Сохранить изменения</button>
        </div>
      </div>
    </div>
  );
};

// --- Новый Клиент ---
export const NewClientModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'person' | 'company'>('person');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Users className="text-blue-500" /> Новый клиент</h2>
        <div className="space-y-6">
           <input type="text" placeholder="Имя или Название" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none" />
           <div className="flex gap-4">
              <button onClick={() => setType('person')} className={`flex-grow py-3 rounded-xl text-xs font-bold uppercase transition-all ${type === 'person' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}>Контакт</button>
              <button onClick={() => setType('company')} className={`flex-grow py-3 rounded-xl text-xs font-bold uppercase transition-all ${type === 'company' ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-500'}`}>Компания</button>
           </div>
           <button onClick={() => onSave({ full_name: name, type })} className="w-full admin-button-primary py-5 font-black uppercase tracking-widest">Создать клиента</button>
        </div>
      </div>
    </div>
  );
};

// --- Настройка этапа ---
export const EditStageModal = ({ isOpen, onClose, onSave, stage }: { isOpen: boolean, onClose: () => void, onSave: (stage: Stage) => void, stage: Stage | null }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');

  const colors = [
    { name: 'Emerald', class: 'bg-[#00FFC2]' },
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Cyan', class: 'bg-cyan-500' }
  ];

  useEffect(() => {
    if (stage) {
      setTitle(stage.title);
      setColor(stage.color || 'bg-blue-500');
    }
  }, [stage]);

  if (!isOpen || !stage) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black flex items-center gap-3"><Zap className="text-amber-500" /> Настройка этапа</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24} /></button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Название этапа</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-amber-500/50"
            />
          </div>
          
          <div className="space-y-3">
             <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Цвет индикатора</label>
             <div className="flex gap-3">
                {colors.map(c => (
                   <button 
                      key={c.class} 
                      onClick={() => setColor(c.class)} 
                      className={`w-10 h-10 rounded-xl transition-all ${c.class} ${color === c.class ? 'ring-4 ring-white/20 scale-110' : 'opacity-40 hover:opacity-100'}`}
                   />
                ))}
             </div>
          </div>

          <button 
            onClick={() => onSave({ ...stage, title, color })}
            className="w-full admin-button-primary py-5 font-black uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <Save size={18} /> Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};
