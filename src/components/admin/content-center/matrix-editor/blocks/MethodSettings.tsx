import { Target } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader, StandardItem, AddButton } from './BaseFields';

interface MethodSettingsProps {
  block: any;
  onChange: (content: any) => void;
}

export const MethodSettings = ({ block, onChange }: MethodSettingsProps) => {
  const content = block.content || {};

  // Normalize items
  const rawItems = content.items || content.methods || [];
  const items = Array.isArray(rawItems) ? rawItems.map((item: any) => {
    if (typeof item === 'string') return { title: item, description: '', icon: 'Target' };
    return {
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || 'Target'
    };
  }) : [];

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleItemUpdate = (idx: number, field: string, val: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    handleUpdate('items', newItems);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Метод / Технология" 
        subtitle="Настройка этапов вашей авторской системы"
        icon={Target}
      />

      <div className="space-y-6">
        <TextField label="Заголовок блока" value={content.title} onChange={(v) => handleUpdate('title', v)} />
        <TextField label="Подзаголовок" value={content.subtitle} onChange={(v) => handleUpdate('subtitle', v)} />
        <TextAreaField label="Описание метода (intro)" value={content.description} onChange={(v) => handleUpdate('description', v)} />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Этапы реализации</h4>
          <AddButton 
            onClick={() => handleUpdate('items', [...items, { title: 'Новый этап', description: '', icon: 'Target' }])}
            label="Добавить"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {items.map((item: any, idx: number) => (
            <StandardItem
              key={idx}
              icon={item.icon || 'Target'}
              onIconChange={(v) => handleItemUpdate(idx, 'icon', v)}
              onDelete={() => handleUpdate('items', items.filter((_: any, i: number) => i !== idx))}
            >
              <TextField 
                label={`Заголовок этапа ${idx + 1}`} 
                value={item.title} 
                onChange={(v) => handleItemUpdate(idx, 'title', v)} 
              />
              <TextField 
                label="Описание" 
                value={item.description} 
                onChange={(v) => handleItemUpdate(idx, 'description', v)} 
              />
            </StandardItem>
          ))}
        </div>
      </div>
    </div>
  );
};

