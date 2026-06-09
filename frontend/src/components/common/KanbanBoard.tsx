import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ReactNode } from 'react';

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  items: KanbanItem[];
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string;
  assignee?: string;
  [key: string]: unknown;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onDragEnd: (result: DropResult) => void;
  renderItem?: (item: KanbanItem) => ReactNode;
  onColumnClick?: (columnId: string) => void;
  onItemClick?: (item: KanbanItem) => void;
}

const priorityStyles = {
  low: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-red-500/20 text-red-400',
};

export default function KanbanBoard({ columns, onDragEnd, renderItem, onColumnClick, onItemClick }: KanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80 card-premium">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="text-sm font-bold text-white">{column.title}</h3>
                  <span className="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                    {column.items.length}
                  </span>
                </div>
                {onColumnClick && (
                  <button onClick={() => onColumnClick(column.id)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    + Adicionar
                  </button>
                )}
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-2 min-h-[200px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-indigo-500/5' : ''}`}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onItemClick?.(item)}
                          className={`mb-2 p-3.5 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                            snapshot.isDragging
                              ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/20 scale-[1.02] bg-indigo-500/10'
                              : 'border-white/10 hover:border-white/20 hover:shadow-lg'
                          }`}
                          style={{
                            background: snapshot.isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                          }}
                        >
                          {renderItem ? (
                            renderItem(item)
                          ) : (
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-1.5">{item.title}</h4>
                              {item.description && (
                                <p className="text-xs text-slate-400 mb-2.5 line-clamp-2">{item.description}</p>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                {item.priority && (
                                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${priorityStyles[item.priority]}`}>
                                    {item.priority === 'low' ? 'Baixa' : item.priority === 'medium' ? 'Media' : 'Alta'}
                                  </span>
                                )}
                                {item.tags?.map((tag) => (
                                  <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-medium">
                                    {tag}
                                  </span>
                                ))}
                                {item.dueDate && (
                                  <span className="text-xs text-slate-500">
                                    {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
