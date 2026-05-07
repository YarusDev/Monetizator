import { Type, Plus, Trash2, Layout } from 'lucide-react';
import { IconSelector } from '../../IconSelector';

interface FieldProps {
  label: string;
  description?: string;
  value: any;
  onChange: (val: any) => void;
}

export const TextField = ({ label, description, value, onChange }: FieldProps) => (
  <div className="space-y-2">
    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">{label}</label>
    <input 
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-[11px] outline-none focus:border-brand-emerald/30 focus:bg-black/60 transition-all"
      placeholder="..."
    />
    {description && <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight px-1">{description}</p>}
  </div>
);

export const TextAreaField = ({ label, description, value, onChange }: FieldProps) => (
  <div className="space-y-2">
    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">{label}</label>
    <textarea 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-[11px] outline-none focus:border-brand-emerald/30 focus:bg-black/60 transition-all min-h-[100px] resize-none"
      placeholder="..."
    />
    {description && <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight px-1">{description}</p>}
  </div>
);

export const ImageField = ({ 
  label, 
  value, 
  onChange, 
  onUpload, 
  isUploading,
  description
}: FieldProps & { onUpload?: (f: File, p: string) => Promise<string | null>, isUploading?: boolean }) => {
  const displayUrl = value?.startsWith('assets/') ? `/${value}` : value;

  return (
    <div className="space-y-3">
      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">{label}</label>
      <div className="flex gap-4">
        <div className="flex-grow space-y-2">
          <div className="flex gap-2">
            <input 
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-grow h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white text-[11px] outline-none focus:border-brand-emerald/30"
              placeholder="URL изображения..."
            />
            {onUpload && (
              <label className="relative flex items-center justify-center px-6 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald hover:text-black cursor-pointer transition-all shrink-0">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await onUpload(file, label);
                      if (url) onChange(url);
                    }
                  }}
                  disabled={isUploading}
                />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </span>
                {isUploading && (
                  <div className="absolute inset-0 bg-brand-emerald flex items-center justify-center rounded-xl">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  </div>
                )}
              </label>
            )}
          </div>
          {description && <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight px-1">{description}</p>}
        </div>
        {value && (
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shrink-0 shadow-2xl">
            {displayUrl ? (
              <img src={displayUrl} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" alt="Preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-800">
                <Layout size={24} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SectionHeader = ({ title, subtitle, icon: Icon = Type }: { title: string, subtitle: string, icon?: any }) => (
  <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
      <Icon size={18} />
    </div>
    <div>
      <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{subtitle}</p>
    </div>
  </div>
);

export const AddButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald hover:text-black transition-all group shrink-0"
  >
    <Plus size={14} className="group-hover:scale-110 transition-transform" />
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="p-3 rounded-xl bg-red-500/5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
    title="Удалить"
  >
    <Trash2 size={14} />
  </button>
);

export const MoveButton = ({ direction, onClick, disabled }: { direction: 'up' | 'down', onClick: () => void, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all shrink-0 disabled:opacity-0"
    title={direction === 'up' ? "Вверх" : "Вниз"}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'up' ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
    </svg>
  </button>
);

export const StandardItem = ({ 
  icon, 
  onIconChange, 
  children, 
  onDelete,
  onMoveUp,
  onMoveDown 
}: { 
  icon: string, 
  onIconChange: (v: string) => void, 
  children: React.ReactNode, 
  onDelete: () => void,
  onMoveUp?: () => void,
  onMoveDown?: () => void
}) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex gap-6 items-center group hover:bg-white/[0.03] transition-all duration-500">
    <div className="shrink-0">
      <IconSelector value={icon} onChange={onIconChange} />
    </div>
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-center">
      {children}
    </div>
    <div className="shrink-0 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
      {onMoveUp && <MoveButton direction="up" onClick={onMoveUp} />}
      {onMoveDown && <MoveButton direction="down" onClick={onMoveDown} />}
      <DeleteButton onClick={onDelete} />
    </div>
  </div>
);

export const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options, 
  description 
}: FieldProps & { options: { label: string, value: string }[] }) => (
  <div className="space-y-2">
    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">{label}</label>
    <div className="relative group">
      <select 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-[11px] outline-none appearance-none focus:border-brand-emerald/30 focus:bg-black/60 transition-all cursor-pointer font-bold"
      >
        <option value="" disabled className="bg-brand-obsidian">Выберите значение...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value} className="bg-brand-obsidian py-4">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-brand-emerald transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
    {description && <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight px-1">{description}</p>}
  </div>
);


