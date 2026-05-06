import React from 'react';
import { MoreVertical, MessageCircle, Phone, Settings2, Clock } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Lead, Stage, Task } from './types';

const SortableLeadCard = ({ lead, stage, onConvert, onEdit, nextTask }: { lead: Lead, stage: Stage, onConvert: (l: Lead) => void, onEdit: (l: Lead) => void, nextTask?: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="glass p-5 rounded-2xl hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group relative"
    >
      <div {...attributes} {...listeners} className="absolute inset-0 z-0"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="font-bold text-white group-hover:text-[#00FFC2] transition-colors line-clamp-1">{lead.name || 'Без имени'}</div>
          <button onClick={() => onEdit(lead)} className="p-1 hover:bg-white/10 rounded-lg pointer-events-auto transition-colors">
            <MoreVertical size={14} className="text-slate-600" />
          </button>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2 mb-3">
          {lead.contact?.includes('@') ? <MessageCircle size={12} className="text-blue-400" /> : <Phone size={12} className="text-[#00FFC2]" />}
          <span className="truncate">{lead.contact || 'Нет контакта'}</span>
        </div>

        {nextTask && (
           <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-xl border border-blue-500/10 mb-4 animate-pulse">
              <Clock size={10} className="text-blue-400" />
              <div className="text-[9px] font-black uppercase text-blue-400 tracking-wider">
                 След. шаг: {new Date(nextTask.due_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </div>
           </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="text-[10px] text-slate-600 font-mono">
            {new Date(lead.created_at).toLocaleDateString('ru-RU')}
          </div>
          {stage.key !== 'won' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onConvert(lead); }}
              className="text-[10px] text-[#00FFC2] font-black uppercase tracking-wider hover:opacity-80 transition-opacity z-10 pointer-events-auto"
            >
              Оплачено
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, leads, onConvert, onEdit, onSettings, tasks }: { stage: Stage, leads: Lead[], onConvert: (l: Lead) => void, onEdit: (l: Lead) => void, onSettings: (s: Stage) => void, tasks: Task[] }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="flex items-center justify-between mb-4 px-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-[0_0_10px_currentColor]`}></div>
          <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-500">{stage.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded-md">{leads.length}</span>
          <button onClick={() => onSettings(stage)} className="p-1 hover:bg-white/5 rounded text-slate-600 hover:text-white transition-colors">
            <Settings2 size={14} />
          </button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`space-y-4 min-h-[600px] p-3 rounded-[2rem] border transition-all duration-200 ${isOver ? 'bg-white/[0.05] border-[#00FFC2]/30' : 'bg-white/[0.02] border-white/5 border-dashed'}`}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => {
            const nextTask = tasks
              .filter(t => t.lead_id === lead.id && t.status === 'pending')
              .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
            
            return (
              <SortableLeadCard 
                key={lead.id} 
                lead={lead} 
                stage={stage} 
                onConvert={onConvert} 
                onEdit={onEdit} 
                nextTask={nextTask}
              />
            );
          })}
        </SortableContext>
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  stages: Stage[];
  leads: Lead[];
  tasks: Task[];
  onDragEnd: (event: any) => void;
  onConvert: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onSettings: (stage: Stage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ stages, leads, tasks, onDragEnd, onConvert, onEdit, onSettings }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
        {stages.map((stage) => (
          <KanbanColumn 
            key={stage.id} 
            stage={stage} 
            leads={leads.filter(l => l.status === stage.key)} 
            tasks={tasks}
            onConvert={onConvert} 
            onEdit={onEdit}
            onSettings={onSettings}
          />
        ))}
      </div>
    </DndContext>
  );
};
