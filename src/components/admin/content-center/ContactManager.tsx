import { useState } from 'react';
import { Send, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ContactModal } from './ContactModal';

export interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string;
  is_active: boolean;
  order_index: number;
}

export const ContactManager = ({ contacts, onUpdate }: { contacts: Contact[], onUpdate: () => void }) => {
  const [editingContact, setEditingContact] = useState<Contact | Partial<Contact> | null>(null);

  const handleSave = async (data: any) => {
    if (data.id) {
      await supabase.from('m_contacts').update(data).eq('id', data.id);
    } else {
      await supabase.from('m_contacts').insert([data]);
    }
    setEditingContact(null);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить этот контакт из глобального списка?')) {
      await supabase.from('m_contacts').delete().eq('id', id);
      onUpdate();
    }
  };

  const toggleVisibility = async (contact: Contact) => {
    if (!contact.value) return;
    const nextStatus = !contact.is_active;
    await supabase.from('m_contacts').update({ is_active: nextStatus }).eq('id', contact.id);
    onUpdate();
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Globe;
    return <IconComponent size={24} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
            <Send className="text-brand-emerald" /> Мои Контакты
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">Глобальный реестр способов связи</p>
        </div>
        <button 
          onClick={() => setEditingContact({ label: '', value: '', type: 'other', icon: 'Globe', is_active: true })}
          className="admin-button-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3"
        >
          <Plus size={16} /> Добавить контакт
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...contacts].sort((a, b) => {
          const aFilled = !!a.value;
          const bFilled = !!b.value;
          const aPriority = !aFilled ? 2 : (a.is_active ? 1 : 3);
          const bPriority = !bFilled ? 2 : (b.is_active ? 1 : 3);
          
          if (aPriority !== bPriority) return aPriority - bPriority;
          return a.order_index - b.order_index;
        }).map(contact => {
          const isFilled = !!contact.value;
          const status = !isFilled ? 'unfilled' : (contact.is_active ? 'active' : 'hidden');
          
          return (
            <div 
              key={contact.id} 
              className={`glass p-6 rounded-[2.5rem] border transition-all group overflow-hidden relative ${
                status === 'active' ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : 
                status === 'hidden' ? 'bg-white/[0.01] border-white/5 opacity-50' : 
                'bg-black/20 border-white/5 grayscale'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                  status === 'active' ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30' : 
                  'bg-white/5 text-slate-500 border-white/5'
                }`}>
                  {getIcon(contact.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider truncate">{contact.label}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${
                      status === 'active' ? 'text-brand-emerald' : 
                      status === 'hidden' ? 'text-slate-500' : 'text-red-500/70'
                    }`}>
                      {status === 'active' && <CheckCircle size={10} />}
                      {status === 'hidden' && <Icons.EyeOff size={10} />}
                      {status === 'unfilled' && <XCircle size={10} />}
                      {status === 'active' ? 'Активен' : status === 'hidden' ? 'Скрыт' : 'Не заполнен'}
                    </div>
                  </div>
                </div>
                
                {/* Actions Group */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setEditingContact(contact)} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-brand-emerald hover:bg-white/10 transition-all border border-white/10" title="Редактировать">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(contact.id)} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-white/10 transition-all border border-white/10" title="Удалить">
                    <Trash2 size={14} />
                  </button>
                  
                  {/* Inline Toggle */}
                  <button
                    onClick={() => toggleVisibility(contact)}
                    disabled={!isFilled}
                    className={`w-9 h-5 rounded-full transition-all relative shrink-0 ml-1 ${
                      !isFilled ? 'bg-slate-800 cursor-not-allowed opacity-20' : 
                      contact.is_active ? 'bg-brand-emerald' : 'bg-slate-700'
                    }`}
                    title={!isFilled ? "Сначала заполните данные" : (contact.is_active ? "Скрыть" : "Показать")}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${contact.is_active && isFilled ? 'left-[18px]' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <p className={`text-[10px] font-medium truncate mb-2 ${isFilled ? 'text-slate-300' : 'text-slate-600 italic'}`}>
                {contact.value || 'Данные не указаны...'}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">ID: {contact.type}</div>
                {status === 'active' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {contacts.length === 0 && !editingContact && (
        <div className="py-40 text-center glass rounded-[3rem] border-white/5 bg-white/[0.01]">
          <div className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">Список контактов пуст</div>
          <p className="text-slate-700 text-[10px] mt-2 font-bold">Добавьте свои социальные сети и мессенджеры для управления</p>
        </div>
      )}

      {editingContact && (
        <ContactModal 
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
