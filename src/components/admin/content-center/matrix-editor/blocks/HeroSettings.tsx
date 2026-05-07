import { Type, Sparkles } from 'lucide-react';
import { TextField, TextAreaField, ImageField, SectionHeader, AddButton, StandardItem } from './BaseFields';

interface HeroSettingsProps {
  block: any;
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const HeroSettings = ({ block, onChange, onUpload, isUploading }: HeroSettingsProps) => {
  const content = block.content || {};

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleMetricUpdate = (idx: number, field: string, val: any) => {
    const metrics = [...(content.metrics || [])];
    metrics[idx] = { ...metrics[idx], [field]: val };
    handleUpdate('metrics', metrics);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Главный экран (Hero)" 
        subtitle="Настройка основного оффера и визуала"
        icon={Type}
      />

      <div className="space-y-6">
        <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-4">Главный визуал</h4>
        <ImageField 
          label="Изображение / Анимация (Coin)" 
          value={content.hero_image} 
          onChange={(v) => handleUpdate('hero_image', v)}
          onUpload={onUpload}
          isUploading={isUploading}
          description="Основная картинка или GIF-анимация (например, монета)"
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-4">Тексты оффера</h4>
        <TextAreaField 
          label="Главный заголовок" 
          value={content.title} 
          onChange={(v) => handleUpdate('title', v)} 
        />
        <TextAreaField 
          label="Подзаголовок" 
          value={content.subtitle} 
          onChange={(v) => handleUpdate('subtitle', v)} 
        />
        <TextAreaField 
          label="Основное описание / Био" 
          value={content.description} 
          onChange={(v) => handleUpdate('description', v)} 
          placeholder="Напр: Сергей Осипук. Монетизатор ресурсов..."
        />
        <TextField 
          label="Текст под кнопкой (Footer)" 
          value={content.footer} 
          onChange={(v) => handleUpdate('footer', v)} 
        />
        <TextField 
          label="Текст кнопки действия" 
          value={content.button_text} 
          onChange={(v) => handleUpdate('button_text', v)} 
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-brand-emerald" />
            <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Метрики успеха (Metrics)</h4>
          </div>
          <AddButton 
            onClick={() => handleUpdate('metrics', [...(content.metrics || []), { value: '0', label: 'Новая метрика', icon: 'TrendingUp' }])}
            label="Добавить метрику"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {(content.metrics || []).map((m: any, idx: number) => (
            <StandardItem
              key={idx}
              icon={m.icon || 'TrendingUp'}
              onIconChange={(v) => handleMetricUpdate(idx, 'icon', v)}
              onDelete={() => handleUpdate('metrics', content.metrics.filter((_: any, i: number) => i !== idx))}
            >
              <TextField 
                label="Значение" 
                value={m.value} 
                onChange={(v) => handleMetricUpdate(idx, 'value', v)} 
              />
              <TextField 
                label="Описание" 
                value={m.label} 
                onChange={(v) => handleMetricUpdate(idx, 'label', v)} 
              />
            </StandardItem>
          ))}
        </div>
      </div>
    </div>
  );
};

