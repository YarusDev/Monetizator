import { ScrollText } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader, AddButton, StandardItem } from './BaseFields';

interface ManifestoSettingsProps {
  block: any;
  onChange: (content: any) => void;
}

export const ManifestoSettings = ({ block, onChange }: ManifestoSettingsProps) => {
  const content = block.content || {};

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleItemUpdate = (idx: number, field: string, val: any) => {
    const items = [...(content.items || [])];
    items[idx] = { ...items[idx], [field]: val };
    handleUpdate('items', items);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Манифест / Идеология" 
        subtitle="Настройка ключевых ценностей и принципов"
        icon={ScrollText}
      />

      <div className="space-y-6">
        <TextField label="Заголовок блока" value={content.title} onChange={(v) => handleUpdate('title', v)} />
        <TextAreaField 
          label="Главный месседж (Subtitle)" 
          value={content.subtitle} 
          onChange={(v) => handleUpdate('subtitle', v)} 
          description="Показывается сразу под заголовком"
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Ключевые тезисы</h4>
          <AddButton 
            onClick={() => handleUpdate('items', [...(content.items || []), { title: 'Заголовок', text: 'Новый тезис', icon: 'Zap' }])}
            label="Добавить тезис"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {(content.items || []).map((item: any, idx: number) => (
            <StandardItem
              key={idx}
              icon={item.icon || 'Zap'}
              onIconChange={(v) => handleItemUpdate(idx, 'icon', v)}
              onDelete={() => handleUpdate('items', content.items.filter((_: any, i: number) => i !== idx))}
            >
              <div className="md:col-span-2 space-y-4">
                <TextField 
                  label="Заголовок тезиса" 
                  value={item.title} 
                  onChange={(v) => handleItemUpdate(idx, 'title', v)} 
                />
                <TextAreaField 
                  label="Текст тезиса" 
                  value={item.text} 
                  onChange={(v) => handleItemUpdate(idx, 'text', v)} 
                />
              </div>
            </StandardItem>
          ))}
        </div>
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-4">Завершение и призыв</h4>
        <TextAreaField 
          label="Текст философии (Footer)" 
          value={content.footer} 
          onChange={(v) => handleUpdate('footer', v)} 
        />
        <TextField 
          label="Текст кнопки действия" 
          value={content.button_text} 
          onChange={(v) => handleUpdate('button_text', v)} 
        />
      </div>
    </div>
  );
};

