import { Save, ExternalLink, AlertCircle, Sparkles, Type } from 'lucide-react';
import { HeroSettings } from './blocks/HeroSettings';
import { ServicesSettings } from './blocks/ServicesSettings';
import { QuizSettings } from './blocks/QuizSettings';
import { CalculatorSettings } from './blocks/CalculatorSettings';
import { ExpertSettings } from './blocks/ExpertSettings';
import { MethodSettings } from './blocks/MethodSettings';
import { CasesSettings } from './blocks/CasesSettings';
import { ContactsSettings } from './blocks/ContactsSettings';
import { AntiTargetSettings } from './blocks/AntiTargetSettings';
import { ManifestoSettings } from './blocks/ManifestoSettings';
import { GiftSettings } from './blocks/GiftSettings';
import { HeaderSettings } from './blocks/HeaderSettings';
import { FooterSettings } from './blocks/FooterSettings';
import { GenericSettings } from './blocks/GenericSettings';

interface EditorFormProps {
  editingBlock: any;
  allBlocks: any[];
  contacts: any[];
  onUpdateBlock: (updates: any) => void;
  onSave: () => void;
  onUpload: (file: File, path: string) => Promise<string | null>;
  isUploading: boolean;
}

export const EditorForm = ({ 
  editingBlock, 
  allBlocks,
  contacts,
  onUpdateBlock, 
  onSave, 
  onUpload, 
  isUploading 
}: EditorFormProps) => {
  if (!editingBlock) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-slate-700">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Блок не выбран</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Выберите блок из списка слева для редактирования</p>
        </div>
      </div>
    );
  }

  const renderSettings = () => {
    const props = {
      block: editingBlock,
      onChange: (content: any) => onUpdateBlock({ content }),
      onUpload,
      isUploading
    };

    switch (editingBlock.block_key) {
      case 'hero': return <HeroSettings {...props} />;
      case 'services': return <ServicesSettings {...props} />;
      case 'quiz': return <QuizSettings {...props} />;
      case 'calculator': return <CalculatorSettings {...props} />;
      case 'expert': return <ExpertSettings {...props} />;
      case 'method': return <MethodSettings {...props} />;
      case 'cases': return <CasesSettings {...props} />;
      case 'contacts': return <ContactsSettings {...props} contacts={contacts} />;
      case 'anti_target': return <AntiTargetSettings {...props} />;
      case 'manifesto': return <ManifestoSettings {...props} />;
      case 'gift': return <GiftSettings {...props} />;
      case 'header': return <HeaderSettings {...props} allBlocks={allBlocks} contacts={contacts} />;
      case 'footer': return <FooterSettings {...props} />;
      default: return <GenericSettings {...props} />;
    }
  };

  const handlePreview = () => {
    window.open(`/#${editingBlock.block_key}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col bg-black/20">
      {/* Header - Sticky */}
      <div className="sticky top-[64px] p-8 border-b border-white/5 flex justify-between items-center bg-black/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
            <Save size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-brand-emerald" />
              <span className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.2em]">Режим редактирования</span>
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.1em] mt-0.5">{editingBlock.block_key}</h2>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handlePreview}
            className="px-6 py-3 rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <ExternalLink size={14} />
            Предпросмотр
          </button>
          <button 
            onClick={onSave}
            className="px-8 py-3 rounded-2xl bg-brand-emerald text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Сохранить всё
          </button>
        </div>
      </div>

      {/* Settings Area - Natural Flow */}
      <div className="p-12 relative min-h-screen">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Metadata Section (Title & Key) */}
          <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-8 backdrop-blur-md">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
                <Type size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Основная информация</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Технические параметры блока</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Название в админке</label>
                    <span className="text-[8px] text-slate-600 font-bold uppercase">Не виден на сайте</span>
                </div>
                <input 
                  type="text"
                  value={editingBlock.title || ''}
                  onChange={(e) => onUpdateBlock({ title: e.target.value })}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-[11px] outline-none focus:border-brand-emerald/30 focus:bg-black/60 transition-all"
                  placeholder="Напр: Метод (Секция 5)"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">ID блока (block_key)</label>
                    <span className="text-[8px] text-red-500/50 font-bold uppercase">Только для профи</span>
                </div>
                <input 
                  type="text"
                  value={editingBlock.block_key || ''}
                  onChange={(e) => onUpdateBlock({ block_key: e.target.value })}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-[11px] font-mono outline-none focus:border-brand-emerald/30 focus:bg-black/60 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Settings Component */}
          <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 backdrop-blur-md">
            {renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};
