import { Layout, Menu, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { TextField, ImageField, SectionHeader, AddButton, DeleteButton, StandardItem, SelectField } from './BaseFields';

interface HeaderSettingsProps {
  block: any;
  allBlocks: any[];
  contacts: any[];
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const HeaderSettings = ({ block, allBlocks, contacts, onChange, onUpload, isUploading }: HeaderSettingsProps) => {
  const content = block.content || {};
  const [showPicker, setShowPicker] = useState(false);

  const anchorOptions = (allBlocks || [])
    .filter(b => b.block_key !== 'header' && b.block_key !== 'footer')
    .map((b: any) => ({
      label: `${b.title} (#${b.block_key})`,
      value: `#${b.block_key}`
    }));

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleNavUpdate = (idx: number, field: string, val: any) => {
    const nav = [...(content.navigation || [])];
    nav[idx] = { ...nav[idx], [field]: val };
    handleUpdate('navigation', nav);
  };


  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Шапка сайта" 
        subtitle="Логотип, брендинг и навигация"
        icon={Layout}
      />

      <div className="space-y-6">
        <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-4">Брендинг и Логотип</h4>
        <div className="grid grid-cols-2 gap-6">
          <TextField 
            label="Название проекта" 
            value={content.project_name} 
            onChange={(v) => handleUpdate('project_name', v)} 
          />
          <TextField 
            label="Имя эксперта (подзаголовок)" 
            value={content.expert_name} 
            onChange={(v) => handleUpdate('expert_name', v)} 
          />
        </div>
        <ImageField 
          label="Иконка Логотипа" 
          value={content.image || content.logo} 
          onChange={(v) => handleUpdate('image', v)}
          onUpload={onUpload}
          isUploading={isUploading}
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Меню навигации</h4>
          <AddButton 
            onClick={() => handleUpdate('navigation', [...(content.navigation || []), { label: 'Новая ссылка', anchor: '#block_key' }])}
            label="Добавить пункт"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {(content.navigation || []).map((item: any, idx: number) => (
            <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-end">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0 mb-2">
                <Menu size={18} />
              </div>
              <div className="flex-grow grid grid-cols-2 gap-4">
                <TextField 
                  label="Текст ссылки" 
                  value={item.label} 
                  onChange={(v) => handleNavUpdate(idx, 'label', v)} 
                />
                <SelectField 
                  label="Якорь (Блок)" 
                  value={item.anchor} 
                  onChange={(v) => handleNavUpdate(idx, 'anchor', v)} 
                  options={anchorOptions}
                />
              </div>
              <DeleteButton onClick={() => handleUpdate('navigation', content.navigation.filter((_: any, i: number) => i !== idx))} />
            </div>
          ))}
        </div>
      </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Быстрые контакты</h4>
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
              const isAdded = (content.contacts || []).find((l: any) => l.contact_id === contact.id);
              return (
                <button
                  key={contact.id}
                  disabled={isAdded}
                  onClick={() => {
                    const newContacts = [...(content.contacts || []), { contact_id: contact.id, is_visible: true }];
                    handleUpdate('contacts', newContacts);
                    setShowPicker(false);
                  }}
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
          {(content.contacts || []).map((item: any, idx: number) => {
            const global = contacts.find(c => c.id === item.contact_id);
            return (
              <StandardItem
                key={`${item.contact_id}-${idx}`}
                icon={global?.icon || item.icon || 'Link'}
                onIconChange={(v) => {
                  const newContacts = [...content.contacts];
                  newContacts[idx] = { ...newContacts[idx], icon: v };
                  handleUpdate('contacts', newContacts);
                }}
                onDelete={() => handleUpdate('contacts', content.contacts.filter((_: any, i: number) => i !== idx))}
                onMoveUp={idx > 0 ? () => {
                  const newContacts = [...content.contacts];
                  [newContacts[idx], newContacts[idx-1]] = [newContacts[idx-1], newContacts[idx]];
                  handleUpdate('contacts', newContacts);
                } : undefined}
                onMoveDown={idx < content.contacts.length - 1 ? () => {
                  const newContacts = [...content.contacts];
                  [newContacts[idx], newContacts[idx+1]] = [newContacts[idx+1], newContacts[idx]];
                  handleUpdate('contacts', newContacts);
                } : undefined}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black text-white uppercase tracking-wider">{global?.label || item.label}</div>
                    <div className="text-[9px] text-slate-500 font-medium truncate max-w-[150px]">{global?.value || 'Нет данных'}</div>
                  </div>
                  <button 
                    onClick={() => {
                      const newContacts = [...content.contacts];
                      newContacts[idx] = { ...newContacts[idx], is_visible: !newContacts[idx].is_visible };
                      handleUpdate('contacts', newContacts);
                    }}
                    className={`p-3 rounded-xl transition-all ${item.is_visible ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {item.is_visible ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                  </button>
                </div>
              </StandardItem>
            );
          })}
        </div>
    </div>
  );
};
