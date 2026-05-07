import { Layout } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader, AddButton, DeleteButton } from './BaseFields';

interface FooterSettingsProps {
  block: any;
  onChange: (content: any) => void;
}

export const FooterSettings = ({ block, onChange }: FooterSettingsProps) => {
  const content = block.content || {};

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Подвал сайта" 
        subtitle="Копирайт и юридическая информация"
        icon={Layout}
      />

      <div className="space-y-6">
        <TextField 
          label="Текст копирайта" 
          value={content.copyright} 
          onChange={(v) => handleUpdate('copyright', v)} 
        />
        <TextAreaField 
          label="Юридическая информация (ИНН, ОГРНИП и т.д.)" 
          value={content.legal_info} 
          onChange={(v) => handleUpdate('legal_info', v)} 
        />
        
        <div className="pt-8 border-t border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Юридические ссылки</h4>
            <AddButton 
              onClick={() => handleUpdate('links', [...(content.links || []), { label: 'Новая ссылка', url: '#' }])}
              label="Добавить ссылку"
            />
          </div>
          <div className="grid gap-4">
            {(content.links || []).map((link: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-end bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <TextField label="Название" value={link.label} onChange={(v) => {
                    const nl = [...content.links];
                    nl[idx].label = v;
                    handleUpdate('links', nl);
                  }} />
                  <TextField label="URL" value={link.url} onChange={(v) => {
                    const nl = [...content.links];
                    nl[idx].url = v;
                    handleUpdate('links', nl);
                  }} />
                </div>
                <DeleteButton onClick={() => handleUpdate('links', content.links.filter((_: any, i: number) => i !== idx))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
