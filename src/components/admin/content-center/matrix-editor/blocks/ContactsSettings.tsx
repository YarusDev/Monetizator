import { MessageCircle, Plus, Eye, EyeOff } from 'lucide-react';
import { TextField, SectionHeader, StandardItem } from './BaseFields';
import { useState } from 'react';

interface ContactsSettingsProps {
  block: any;
  contacts: any[];
  onChange: (content: any) => void;
}

export const ContactsSettings = ({ block, contacts, onChange }: ContactsSettingsProps) => {
  const content = block.content || {};
  const links = content.links || [];
  const [showPicker, setShowPicker] = useState(false);

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const moveLink = (idx: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < newLinks.length) {
      [newLinks[idx], newLinks[targetIdx]] = [newLinks[targetIdx], newLinks[idx]];
      handleUpdate('links', newLinks);
    }
  };

  const toggleVisibility = (idx: number) => {
    const newLinks = [...links];
    newLinks[idx] = { ...newLinks[idx], is_visible: !newLinks[idx].is_visible };
    handleUpdate('links', newLinks);
  };

  const addFromGlobal = (contact: any) => {
    if (links.find((l: any) => l.contact_id === contact.id)) return;
    const newLink = {
      contact_id: contact.id,
      label: contact.label,
      icon: contact.icon,
      is_visible: true
    };
    handleUpdate('links', [...links, newLink]);
    setShowPicker(false);
  };

  // Helper to get global data for a link
  const getGlobalData = (contactId: string) => {
    return contacts.find(c => c.id === contactId);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Контакты" 
        subtitle="Настройка способов связи и ссылок"
        icon={MessageCircle}
      />

      <div className="space-y-6">
        <TextField 
          label="Заголовок" 
          value={content.title} 
          onChange={(v) => handleUpdate('title', v)} 
        />
        <TextField 
          label="Текст призыва (CTA)" 
          value={content.cta_text} 
          onChange={(v) => handleUpdate('cta_text', v)} 
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Выбранные контакты</h4>
          <button 
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-emerald/10 text-brand-emerald text-[9px] font-black uppercase tracking-widest hover:bg-brand-emerald/20 transition-all border border-brand-emerald/20"
          >
            <Plus size={14} /> Из моих контактов
          </button>
        </div>

        {showPicker && (
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {contacts.filter(c => c.is_active).map(contact => {
              const isAdded = links.find((l: any) => l.contact_id === contact.id);
              return (
                <button
                  key={contact.id}
                  disabled={isAdded}
                  onClick={() => addFromGlobal(contact)}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    isAdded 
                      ? 'bg-black/20 border-white/5 text-slate-600 cursor-not-allowed' 
                      : 'bg-white/5 border-white/5 text-white hover:border-brand-emerald/30 hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-emerald">
                    <Plus size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-wider truncate">{contact.label}</div>
                    <div className="text-[8px] text-slate-500 truncate">{contact.value}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {links.map((link: any, idx: number) => {
            const global = getGlobalData(link.contact_id);
            return (
              <StandardItem
                key={link.contact_id}
                icon={global?.icon || link.icon || 'Link'}
                onIconChange={(v) => {
                  const newLinks = [...links];
                  newLinks[idx] = { ...newLinks[idx], icon: v };
                  handleUpdate('links', newLinks);
                }}
                onDelete={() => handleUpdate('links', links.filter((_: any, i: number) => i !== idx))}
                onMoveUp={idx > 0 ? () => moveLink(idx, 'up') : undefined}
                onMoveDown={idx < links.length - 1 ? () => moveLink(idx, 'down') : undefined}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-wider">{global?.label || link.label}</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate max-w-[200px]">{global?.value || 'Не заполнено в "Моих контактах"'}</div>
                    </div>
                    <button 
                      onClick={() => toggleVisibility(idx)}
                      className={`p-3 rounded-xl transition-all ${link.is_visible ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-slate-800 text-slate-500'}`}
                      title={link.is_visible ? 'Виден на сайте' : 'Скрыт в этом блоке'}
                    >
                      {link.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {!global && (
                    <div className="text-[8px] text-red-500/70 font-black uppercase tracking-tighter">Внимание: Контакт удален из общего списка!</div>
                  )}
                </div>
              </StandardItem>
            );
          })}
        </div>
      </div>
    </div>
  );
};
