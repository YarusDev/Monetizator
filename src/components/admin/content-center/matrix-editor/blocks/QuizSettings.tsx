import { HelpCircle, X } from 'lucide-react';
import { TextField, TextAreaField, SectionHeader, StandardItem, ImageField } from './BaseFields';

interface QuizSettingsProps {
  block: any;
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const QuizSettings = ({ block, onChange, onUpload, isUploading }: QuizSettingsProps) => {
  const content = block.content || {};
  const questions = content.questions || [];

  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  const handleQuestionUpdate = (idx: number, data: any) => {
    const newQuestions = [...questions];
    newQuestions[idx] = data;
    handleUpdate('questions', newQuestions);
  };

  const handleAddQuestion = () => {
    const newQ = { 
      text: 'Новый вопрос', 
      type: 'single', 
      options: [
        { text: 'Вариант 1', value: 'v1' },
        { text: 'Вариант 2', value: 'v2' }
      ] 
    };
    handleUpdate('questions', [...questions, newQ]);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title="Квиз / Опрос" 
        subtitle="Настройка вопросов и вариантов ответов"
        icon={HelpCircle}
      />

      <div className="space-y-6">
        <TextField 
          label="Заголовок квиза (на сайте)" 
          value={content.title || ""} 
          onChange={(v) => handleUpdate('title', v)} 
          placeholder="Напр: Получи персональную карту роста"
        />
        <TextAreaField 
          label="Описание / Подзаголовок" 
          value={content.description || ""} 
          onChange={(v) => handleUpdate('description', v)} 
          placeholder="Дополнительный текст под заголовком"
        />
        
        <div className="pt-6 border-t border-white/5">
          <ImageField 
            label="Изображение для превью" 
            value={content.image} 
            onChange={(v) => handleUpdate('image', v)}
            onUpload={onUpload}
            isUploading={isUploading}
            description="Отображается над вопросами квиза"
          />
        </div>
      </div>

      <div className="space-y-8 border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[10px] text-brand-emerald font-black uppercase tracking-[0.2em]">Вопросы ({questions.length})</h4>
          <button 
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-brand-emerald/10 text-brand-emerald rounded-xl text-[9px] font-black hover:bg-brand-emerald/20 transition-all"
          >
            + Добавить вопрос
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q: any, qIdx: number) => (
            <StandardItem
              key={qIdx}
              icon={q.icon || 'HelpCircle'}
              onIconChange={(v) => handleQuestionUpdate(qIdx, { ...q, icon: v })}
              onDelete={() => handleUpdate('questions', questions.filter((_: any, i: number) => i !== qIdx))}
            >
              <div className="md:col-span-2 space-y-6">
                <TextField 
                  label={`Вопрос ${qIdx + 1}`}
                  value={q.text} 
                  onChange={(v) => handleQuestionUpdate(qIdx, { ...q, text: v })} 
                />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Варианты ответов</span>
                    <button 
                      onClick={() => {
                        const newOpts = [...(q.options || []), { text: 'Новый вариант', value: `v${(q.options?.length || 0) + 1}` }];
                        handleQuestionUpdate(qIdx, { ...q, options: newOpts });
                      }}
                      className="text-[9px] text-brand-emerald hover:underline uppercase font-black"
                    >
                      + Добавить ответ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(q.options || []).map((opt: any, oIdx: number) => (
                      <div key={oIdx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[oIdx] = { ...opt, text: e.target.value };
                            handleQuestionUpdate(qIdx, { ...q, options: newOpts });
                          }}
                          className="flex-grow bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-[10px] outline-none focus:border-brand-emerald/30"
                        />
                        <button 
                          onClick={() => {
                            const newOpts = q.options.filter((_: any, i: number) => i !== oIdx);
                            handleQuestionUpdate(qIdx, { ...q, options: newOpts });
                          }}
                          className="w-8 h-8 flex items-center justify-center text-red-500/30 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StandardItem>
          ))}
        </div>
      </div>
    </div>
  );
};
