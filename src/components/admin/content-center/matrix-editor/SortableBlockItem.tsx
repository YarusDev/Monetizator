import { Layout, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ContentBlock } from './types';

export const SortableBlockItem = ({ block, isSelected, onSelect }: { block: ContentBlock, isSelected: boolean, onSelect: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
        isSelected 
          ? 'bg-[#00FFC2]/10 border-[#00FFC2]/20 text-white shadow-lg shadow-[#00FFC2]/5' 
          : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-700 hover:text-slate-400 transition-colors">
        <GripVertical size={14} />
      </div>

      <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-[#00FFC2] text-black' : 'bg-white/5 text-slate-600'}`}>
        <Layout size={14} />
      </div>
      <div className="flex-grow min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-tighter opacity-50">{block.block_key}</div>
        <div className="text-xs font-black truncate uppercase tracking-tight">{block.title}</div>
      </div>
    </div>
  );
};
