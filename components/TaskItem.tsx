
import React from 'react';
import { Check, Square, Pin, Highlighter, Ban, FolderKanban, StickyNote, Redo2, Pencil, Trash2 } from 'lucide-react';
import { Todo, Settings } from '../types';

interface TaskItemProps {
    todo: Todo;
    highlightedTodoId: string | null;
    selectionMode: boolean;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleFocus: (id: string) => void;
    onToggleTodo: (id: string) => void;
    onOpenModal: (todo: Todo) => void;
    onTagClick: (tag: string) => void;
    onTagRemove: (tag: string) => void;
    onReenterTodo: (id: string) => void;
    onDismissTodo: (id: string) => void;
    onCancelTodo: (id: string) => void;
    onDeleteTodo: (id: string) => void;
    settings: Settings;
    itemRef: (el: HTMLLIElement | null) => void;
    statusFilter: string | null;
}

const LinkifiedText: React.FC<{ text: string; onTagClick: (t: string) => void; onTagRemove: (t: string) => void }> = ({ text, onTagClick, onTagRemove }) => {
    const regex = /(https?:\/\/[^\s]+|[@#][\w-]+)/g;
    const parts = text.split(regex);
    const getEmoji = (url: string) => { try { const h = new URL(url).hostname; if(h.includes('google')) return '🔍'; return '🔗'; } catch { return '🔗'; } };
    
    return <>{parts.map((part, i) => { 
        if (part.match(/^https?:\/\//)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} title={part} className="text-primary hover:underline mx-1 relative z-30">{getEmoji(part)} {part.replace(/^https?:\/\/(www\.)?/, '').substring(0,20)+(part.length>25?'...':'')}</a>; 
        if (part.match(/^@\w+/)) return <button key={i} title="Click to filter, Shift+Click to remove" onClick={(e) => { e.stopPropagation(); if(e.shiftKey && onTagRemove) onTagRemove(part); else onTagClick(part); }} className="text-primary font-bold mx-0.5 hover:underline cursor-pointer bg-transparent border-none p-0">{part}</button>; 
        if (part.match(/^#[\w-]+/)) return <button key={i} title="Click to filter, Shift+Click to remove" onClick={(e) => { e.stopPropagation(); if(e.shiftKey && onTagRemove) onTagRemove(part); else onTagClick(part); }} className="text-fuchsia-600 dark:text-fuchsia-400 font-bold mx-0.5 hover:underline cursor-pointer bg-transparent border-none p-0">{part}</button>; 
        return <span key={i}>{part}</span>; 
    })}</>;
};

const TaskItem: React.FC<TaskItemProps> = ({ 
    todo, highlightedTodoId, selectionMode, selectedIds, onToggleSelect, 
    onToggleFocus, onToggleTodo, onOpenModal, onTagClick, onTagRemove,
    onReenterTodo, onDismissTodo, onCancelTodo, onDeleteTodo, settings, itemRef, statusFilter
}) => {
    const isHighlighted = highlightedTodoId === todo.id;
    const isSelected = selectedIds.has(todo.id);
    const isProject = todo.text.toLowerCase().includes('#prj');
    
    const fontClass = { 'sans': 'font-sans', 'serif': 'font-serif', 'mono': 'font-mono' }[settings.fontFamily] || 'font-sans';
    const sizeClass = { 'compact': 'text-base', 'normal': 'text-lg', 'large': 'text-xl' }[settings.fontSize] || 'text-lg';

    let rowStyles = "px-4 gap-3"; 
    let isRowColored = false;
    
    if (isHighlighted) { 
        let bgClass = "bg-primary-50"; 
        if (todo.isDismissed) bgClass = "bg-yellow-100 dark:bg-yellow-900/40"; 
        else if (todo.isCompleted) bgClass = "bg-emerald-100 dark:bg-emerald-900/20"; 
        else if (todo.isCancelled) bgClass = "bg-gray-100 dark:bg-gray-800";
        if (isProject) bgClass = "bg-fuchsia-100 dark:bg-fuchsia-900/30"; 
        rowStyles = `-mx-4 px-8 border-2 border-primary shadow-lg z-20 scale-[1.02] rounded-lg ring-1 ring-primary/20 gap-3 ${bgClass}`; 
        isRowColored = true; 
    }
    else if (todo.isCompleted) { rowStyles = "-mx-4 px-8 bg-emerald-500/10 gap-3"; isRowColored = true; }
    else if (todo.isDismissed) { rowStyles = "-mx-4 px-8 bg-yellow-200 dark:bg-yellow-500/20 gap-3"; isRowColored = true; }
    else if (todo.isCancelled) { rowStyles = "-mx-4 px-8 bg-gray-200/50 dark:bg-gray-800/50 gap-3"; isRowColored = true; }
    else if (isProject) { rowStyles = "-mx-4 px-8 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 gap-3"; isRowColored = true; }
    
    if (selectionMode && isSelected) { rowStyles += " bg-primary-50/50"; }

    return (
        <li ref={itemRef} className={`h-[28px] flex items-center group relative transition-all duration-300 rounded-md ${rowStyles}`} onClick={() => selectionMode && onToggleSelect(todo.id)}>
            <div className={`absolute w-10 h-full flex items-center justify-center z-20 top-0 transition-all ${isRowColored ? '-left-[2.5rem]' : '-left-14'}`}>
                {selectionMode ? (
                    <button onClick={(e) => { e.stopPropagation(); onToggleSelect(todo.id); }} title={isSelected ? "Deselect" : "Select"} className={`transition-all ${isSelected ? 'text-primary' : 'text-paper-line hover:text-ink'}`}>
                        {isSelected ? <div className="w-[18px] h-[18px] bg-primary rounded flex items-center justify-center text-primary-fg shadow-sm"><Check size={12} strokeWidth={3} /></div> : <Square size={18} />}
                    </button>
                ) : !todo.isCompleted && !todo.isCancelled ? (
                    <button onClick={(e) => { e.stopPropagation(); onToggleFocus(todo.id); }} title={todo.isFocused ? "Unfocus Task" : "Focus Task (Pin)"} className={`flex items-center justify-center w-full h-full transition-all duration-200 ${todo.isFocused ? 'text-amber-500 opacity-100' : todo.isDismissed ? 'text-amber-600 dark:text-amber-400 opacity-100' : 'text-ink-dim opacity-0 group-hover:opacity-100 hover:text-amber-500'}`}>
                        {todo.isFocused ? <Pin size={16} fill="currentColor" /> : todo.isDismissed ? <Highlighter size={16} /> : <Pin size={16} />}
                    </button>
                ) : null}
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); onToggleTodo(todo.id); }} title={todo.isCompleted ? "Mark as Undone" : "Mark as Done"} className={`w-4 h-4 flex items-center justify-center rounded-[4px] border transition-all z-20 shadow-sm flex-shrink-0 ${todo.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : todo.isCancelled ? 'bg-transparent border-gray-400 text-gray-400' : 'border-ink-dim hover:border-primary text-transparent bg-white/60 dark:bg-black/20'}`}>
                {todo.isCancelled ? <Ban size={10} strokeWidth={3} /> : <Check size={10} strokeWidth={3} />}
            </button>
            
            <span title="Click to edit details" onClick={(e) => { e.stopPropagation(); onOpenModal(todo); }} className={`${sizeClass} ${fontClass} truncate flex-1 leading-[28px] pt-[1px] transition-all duration-300 font-medium cursor-pointer flex items-center gap-2 ${todo.isCompleted ? 'line-through text-emerald-600/50' : todo.isCancelled ? 'line-through decoration-2 decoration-gray-400/50 text-gray-400 dark:text-gray-600' : todo.isDismissed ? 'text-yellow-900 dark:text-yellow-100' : 'text-ink'}`}>
                {statusFilter && <span className="text-[10px] font-mono opacity-50 flex-shrink-0 bg-black/5 dark:bg-white/10 px-1 rounded">P{todo.pageIndex+1}</span>} 
                {isProject && !todo.isCompleted && !todo.isCancelled && <FolderKanban size={14} className="text-fuchsia-500 flex-shrink-0" />}
                <span className="truncate">
                    <LinkifiedText text={todo.text} onTagClick={onTagClick} onTagRemove={(tag) => { const newText = todo.text.replace(tag, '').replace(/\s+/, ' ').trim(); const notes = todo.notes; onOpenModal({...todo, text: newText}); }} />
                </span>
                {todo.notes && <StickyNote size={12} className="text-ink-dim flex-shrink-0 ml-1 opacity-70" fill="currentColor" />}
            </span>
            
            {isHighlighted && <div className="hidden sm:block absolute right-2 text-[10px] text-primary font-bold uppercase tracking-wider opacity-50">Active</div>}
            
            <div className="hidden group-hover:flex items-center gap-1 bg-paper shadow-sm border border-paper-line absolute right-2 top-0.5 bottom-0.5 z-20 px-1 rounded">
                {!todo.isCompleted && !todo.isDismissed && !todo.isCancelled && <button onClick={(e) => { e.stopPropagation(); onReenterTodo(todo.id); }} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="Re-enter task at end of list (Shift+Enter)"><Redo2 size={14} /></button>}
                {!todo.isCompleted && !todo.isCancelled && <>
                    <button onClick={(e) => { e.stopPropagation(); onOpenModal(todo); }} className="p-1.5 text-ink-dim hover:text-primary" title="Edit Task Details"><Pencil size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDismissTodo(todo.id); }} className={`p-1.5 ${todo.isDismissed ? 'text-amber-600' : 'text-ink-dim hover:text-amber-600'}`} title={todo.isDismissed ? "Un-highlight" : "Highlight (Dismiss)"}><Highlighter size={14} /></button>
                </>}
                {!todo.isCompleted && <button onClick={(e) => { e.stopPropagation(); onCancelTodo(todo.id); }} className={`p-1.5 ${todo.isCancelled ? 'text-gray-600' : 'text-ink-dim hover:text-gray-600'}`} title={todo.isCancelled ? "Un-cancel" : "Cancel (Abandon)"}><Ban size={14} /></button>}
                <button onClick={(e) => { e.stopPropagation(); onDeleteTodo(todo.id); }} className="p-1.5 text-ink-dim hover:text-red-500" title="Delete permanently"><Trash2 size={14} /></button>
            </div>
        </li>
    );
};

export default TaskItem;
