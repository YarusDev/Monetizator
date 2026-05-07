import { useState } from 'react';
import { X, Save } from 'lucide-react';
import * as Icons from 'lucide-react';
import { IconSelector } from './IconSelector';

const CONTACT_TYPES = [
  { id: 'instagram', label: 'Instagram', icon: 'Instagram', placeholder: '@username' },
  { id: 'telegram', label: 'Telegram', icon: 'Send', placeholder: '@username' },
  { id: 'telegram_channel', label: 'Telegram Channel', icon: 'Send', placeholder: 't.me/channel' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'Phone', placeholder: '+79000000000' },
  { id: 'vk', label: 'VK', icon: 'MessageCircle', placeholder: 'vk.com/id' },
  { id: 'vk_group', label: 'VK Group', icon: 'MessageCircle', placeholder: 'vk.com/group' },
  { id: 'phone', label: 'Телефон', icon: 'Phone', placeholder: '+7...' },
  { id: 'email', label: 'Email', icon: 'Mail', placeholder: 'example@mail.com' },
  { id: 'youtube', label: 'YouTube', icon: 'Youtube', placeholder: 'youtube.com/c/channel' },
  { id: 'other', label: 'Другое', icon: 'Link', placeholder: 'https://...' },
];

interface ContactModalProps {
  contact: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const ContactModal = ({ contact, onClose, onSave }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    type: 'telegram',
    label: '',
    value: '',
    icon: 'Send',
    is_active: true,
    ...contact
  });

  const handleTypeChange = (typeId: string) => {
    const type = CONTACT_TYPES.find(t => t.id === typeId);
    if (type) {
      setFormData({
        ...formData,
        type: typeId,
        label: type.label,
        icon: type.icon
      });
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComponent size={20} />;
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-dark border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              {contact ? 'Редактировать контакт' : 'Добавить контакт'}
            </h3>
            <p className="text-[10px] text-brand-emerald font-black uppercase tracking-widest mt-1">Глобальные настройки связи</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Type Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-brand-emerald uppercase tracking-widest ml-4">Тип контакта</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTACT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                    formData.type === type.id 
                    ? 'bg-brand-emerald/10 border-brand-emerald/30 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.type === type.id ? 'bg-brand-emerald/20' : 'bg-white/5'}`}>
                    {renderIcon(type.icon)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Label and Icon */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-emerald uppercase tracking-widest ml-4">Название и Иконка</label>
              <div className="flex gap-3">
                <IconSelector 
                  value={formData.icon}
                  onChange={(v) => setFormData({ ...formData, icon: v })}
                />
                <input
                  type="text"
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-emerald/50 transition-all"
                  placeholder="Напр: Личный Telegram"
                />
              </div>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-emerald uppercase tracking-widest ml-4">Значение (Ссылка/Ник/Телефон)</label>
              <input
                type="text"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-emerald/50 transition-all font-mono"
                placeholder={CONTACT_TYPES.find(t => t.id === formData.type)?.placeholder}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-wider">Активен</div>
              <div className="text-[8px] text-slate-500 font-bold uppercase mt-1">Отображать в списках для выбора</div>
            </div>
            <button
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              className={`w-12 h-6 rounded-full transition-all relative ${formData.is_active ? 'bg-brand-emerald' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_active ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-[2] px-8 py-4 rounded-2xl bg-brand-emerald text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-emerald-light transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} /> Сохранить контакт
          </button>
        </div>
      </div>
    </div>
  );
};
