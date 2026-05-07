import { UserCheck } from 'lucide-react';
import { TextField, TextAreaField, ImageField, SectionHeader, AddButton, StandardItem } from './BaseFields';

interface ExpertSettingsProps {
  block: any;
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const ExpertSettings = ({ block, onChange, onUpload, isUploading }: ExpertSettingsProps) => {
  const content = block.content || {};
  
  // Normalize achievements to always be an array of objects
  const rawAchievements = content.achievements || [];
  const achievements = Array.isArray(rawAchievements) ? rawAchievements.map((a: any) => {
    if (typeof a === 'string') return { title: a, desc: '', icon: 'Award' };
    if (typeof a === 'object' && a !== null) return { 
      title: a.title || a.text || '', 
      desc: a.desc || a.description || '',
      icon: a.icon || 'Award'
    };
    return { title: '', desc: '', icon: 'Award' };
  }) : [];
  
  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleAchievementUpdate = (idx: number, field: string, val: any) => {
    const newAchievements = [...achievements];
    newAchievements[idx] = { ...newAchievements[idx], [field]: val };
    handleUpdate('achievements', newAchievements);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Об эксперте" 
        subtitle="Персональный брендинг и достижения"
        icon={UserCheck}
      />

      <div className="space-y-6">
        <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-4">Основное</h4>
        <TextField 
          label="Заголовок блока" 
          value={content.title} 
          onChange={(v) => handleUpdate('title', v)} 
        />
        <TextField 
          label="Подзаголовок" 
          value={content.subtitle} 
          onChange={(v) => handleUpdate('subtitle', v)} 
        />
        <TextField 
          label="Имя эксперта" 
          value={content.name} 
          onChange={(v) => handleUpdate('name', v)} 
        />
        <TextField 
          label="Специализация/Роль" 
          value={content.role} 
          onChange={(v) => handleUpdate('role', v)} 
        />
        <TextAreaField 
          label="Краткая биография" 
          value={content.description} 
          onChange={(v) => handleUpdate('description', v)} 
        />
        <ImageField 
          label="Фото эксперта" 
          value={content.image} 
          onChange={(v) => handleUpdate('image', v)}
          onUpload={onUpload}
          isUploading={isUploading}
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em]">Достижения (Achievements)</h4>
          <AddButton 
            onClick={() => handleUpdate('achievements', [...achievements, { title: 'Новое достижение', desc: '', icon: 'Award' }])}
            label="Добавить"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((a: any, idx: number) => (
            <StandardItem
              key={idx}
              icon={a.icon || 'Award'}
              onIconChange={(v) => handleAchievementUpdate(idx, 'icon', v)}
              onDelete={() => handleUpdate('achievements', achievements.filter((_: any, i: number) => i !== idx))}
            >
              <TextField 
                label="Заголовок/Цифра" 
                value={a.title} 
                onChange={(v) => handleAchievementUpdate(idx, 'title', v)} 
              />
              <TextField 
                label="Описание" 
                value={a.desc} 
                onChange={(v) => handleAchievementUpdate(idx, 'desc', v)} 
              />
            </StandardItem>
          ))}
        </div>
      </div>

      <div className="space-y-6 border-t border-white/5 pt-12">
        <h4 className="text-[9px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-4">Цитата / Месседж</h4>
        <TextAreaField 
          label="Текст цитаты" 
          value={content.quote} 
          onChange={(v) => handleUpdate('quote', v)} 
        />
        <TextField 
          label="Подпись к цитате" 
          value={content.quote_author} 
          onChange={(v) => handleUpdate('quote_author', v)} 
        />
      </div>
    </div>
  );
};

