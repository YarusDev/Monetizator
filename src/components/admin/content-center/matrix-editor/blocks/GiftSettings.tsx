import { Gift, Sparkles } from 'lucide-react';
import { TextField, TextAreaField, ImageField, SectionHeader, AddButton, DeleteButton } from './BaseFields';

interface GiftSettingsProps {
  block: any;
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const GiftSettings = ({ block, onChange, onUpload, isUploading }: GiftSettingsProps) => {
  const content = block.content || {};

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Лид-магнит / Подарок" 
        subtitle="Настройка бесплатного предложения"
        icon={Gift}
      />

      <div className="space-y-6">
        <TextField label="Надзаголовок (Badge)" value={content.badge} onChange={(v) => handleUpdate('badge', v)} />
        <TextField label="Главный заголовок" value={content.title} onChange={(v) => handleUpdate('title', v)} />
        <TextField label="Подзаголовок (SectionHeader)" value={content.subtitle} onChange={(v) => handleUpdate('subtitle', v)} />
        <TextAreaField label="Описание подарка" value={content.description} onChange={(v) => handleUpdate('description', v)} />
        <TextField label="Текст на кнопке" value={content.button_text} onChange={(v) => handleUpdate('button_text', v)} />
        <TextField label="Предупреждение (Attention)" value={content.attention} onChange={(v) => handleUpdate('attention', v)} />
        <TextField label="Текст под кнопкой (Footer)" value={content.footer} onChange={(v) => handleUpdate('footer', v)} />
        
        <div className="pt-6 border-t border-white/5">
          <ImageField 
            label="Изображение подарка (Mockup)" 
            value={content.image} 
            onChange={(v) => handleUpdate('image', v)}
            onUpload={onUpload}
            isUploading={isUploading}
          />
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Список преимуществ</h4>
            <AddButton 
              onClick={() => handleUpdate('items', [...(content.items || []), { text: 'Новое преимущество', icon: 'CheckCircle2' }])}
              label="Добавить"
            />
          </div>
          <div className="grid gap-4">
            {(content.items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-end bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <TextField label="Текст" value={typeof item === 'string' ? item : item.text} onChange={(v) => {
                  const ni = [...content.items];
                  if (typeof ni[idx] === 'string') ni[idx] = { text: v, icon: 'CheckCircle2' };
                  else ni[idx].text = v;
                  handleUpdate('items', ni);
                }} />
                <DeleteButton onClick={() => handleUpdate('items', content.items.filter((_: any, i: number) => i !== idx))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-brand-gold/5 border border-brand-gold/10 flex gap-4">
        <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
          <Sparkles size={14} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Совет по конверсии</h4>
          <p className="text-[9px] text-slate-500 font-medium">Используйте качественное изображение 3D-мокапа или обложки гайда. Это повышает ценность в глазах пользователя.</p>
        </div>
      </div>
    </div>
  );
};
