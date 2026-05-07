import { Layout, ChevronRight, Save, Trash2, Plus } from 'lucide-react';

interface EditorSidebarProps {
  blocks: any[];
  editingBlock: any | null;
  onSelectBlock: (block: any) => void;
  onAddBlock: () => void;
  onDeleteBlock: (id: string) => void;
  isSaving: boolean;
  onSave: () => void;
}

export const EditorSidebar = ({
  blocks,
  editingBlock,
  onSelectBlock,
  onAddBlock,
  onDeleteBlock,
  isSaving,
  onSave
}: EditorSidebarProps) => {
  return (
    <div className="w-80 border-r border-white/5 bg-black/20 flex flex-col sticky top-8 h-fit max-h-[calc(100vh-64px)]">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-emerald/10 flex items-center justify-center border border-brand-emerald/20">
            <Layout className="text-brand-emerald" size={20} />
          </div>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Контент</h2>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Матрица блоков</div>
          </div>
        </div>
        <button 
          onClick={onAddBlock}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-emerald hover:bg-brand-emerald/10 hover:border-brand-emerald/20 border border-transparent transition-all"
          title="Добавить блок"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {blocks.map((block) => {
          const isActive = editingBlock?.id === block.id;
          return (
            <div key={block.id} className="group relative">
              <button
                onClick={() => onSelectBlock(block)}
                className={`w-full text-left p-4 rounded-[1.5rem] border transition-all duration-300 flex items-center gap-4 ${
                  isActive 
                    ? 'bg-brand-emerald/10 border-brand-emerald/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isActive ? 'bg-brand-emerald/20 border-brand-emerald/30' : 'bg-black/40 border-white/5'
                }`}>
                  <Layout size={16} className={isActive ? 'text-brand-emerald' : 'text-slate-500'} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className={`text-[10px] font-black uppercase tracking-widest truncate ${isActive ? 'text-brand-emerald' : 'text-slate-400'}`}>
                    {block.title}
                  </div>
                  <div className="text-[8px] text-slate-600 font-bold uppercase tracking-tight font-mono mt-0.5">
                    ID: {block.block_key}
                  </div>
                </div>
                <ChevronRight size={14} className={`transition-transform duration-300 ${isActive ? 'text-brand-emerald translate-x-1' : 'text-slate-700'}`} />
              </button>
              
              {!isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Удалить этот блок?')) onDeleteBlock(block.id);
                  }}
                  className="absolute right-2 top-2 w-6 h-6 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all flex items-center justify-center"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full h-14 bg-brand-emerald text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center gap-3 hover:bg-[#00FFC2] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} />
              <span>Сохранить всё</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
