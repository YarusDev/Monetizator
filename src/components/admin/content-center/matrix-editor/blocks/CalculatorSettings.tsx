import { Calculator } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader } from './BaseFields';

interface CalculatorSettingsProps {
  block: any;
  onChange: (content: any) => void;
}

export const CalculatorSettings = ({ block, onChange }: CalculatorSettingsProps) => {
  const content = block.content || {};

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Калькулятор" 
        subtitle="Настройка текстов и призыва к действию"
        icon={Calculator}
      />

      <div className="space-y-6">
        <TextField 
          label="Заголовок калькулятора" 
          value={content.title} 
          onChange={(v) => handleUpdate('title', v)} 
        />
        <TextAreaField 
          label="Подзаголовок" 
          value={content.subtitle} 
          onChange={(v) => handleUpdate('subtitle', v)} 
        />
        <TextField 
          label="Текст кнопки расчета" 
          value={content.button_text} 
          onChange={(v) => handleUpdate('button_text', v)} 
        />
      </div>

      <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
          <Calculator size={14} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Обратите внимание</h4>
          <p className="text-[9px] text-slate-500 font-medium">Алгоритм калькулятора (формулы) настраивается в коде компонента. Здесь вы можете изменить только тексты.</p>
        </div>
      </div>
    </div>
  );
};
