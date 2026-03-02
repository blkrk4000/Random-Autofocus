
import React, { useRef, useEffect, useMemo } from 'react';
import { Target, Filter, Eraser, X, Download, Clipboard, ListChecks, Dices, Sparkles, Check, Pin, Highlighter, Ban, Trash2, Redo2, Tags, FileJson } from 'lucide-react';
import { Todo, Settings } from '../types';
import TaskItem from './TaskItem';
import { DENSITY_CONFIG } from '../constants';
import { generateMarkdown, downloadJSON, copyToClipboard } from '../utils/exportUtils';

interface NotebookPageProps {
    pageIndex: number;
    todos: Todo[];
    highlightedTodoId: string | null;
    isFocusMode: boolean;
    statusFilter: string | null;
    selectionMode: boolean;
    selectedIds: Set<string>;
    settings: Settings;
    onToggleTodo: (id: string) => void;
    onDeleteTodo: (id: string) => void;
    onDismissTodo: (id: string) => void;
    onReenterTodo: (id: string) => void;
    onToggleFocus: (id: string) => void;
    onCancelTodo: (id: string) => void;
    onOpenModal: (todo: Todo) => void;
    onTagClick: (tag: string) => void;
    onUpdateTodo: (id: string, text: string, notes: string) => void;
    onToggleSelect: (id: string) => void;
    onSelectAll: () => void;
    onToggleSelectionMode: () => void;
    onClearFocus: () => void;
    onRollDice: () => void;
    canRoll: boolean;
    onSetStatusFilter: (status: string | null) => void;
    onExportVisible: () => void;
    onCopyMD: () => void;
    onHighlightTodo: (id: string | null) => void; 
    onOpenBatchTag: () => void;
    onDeletePage: () => void;
}

const DiceRoller = ({ onRoll, disabled }: { onRoll: () => void, disabled: boolean }) => {
    const [isRolling, setIsRolling] = React.useState(false);
    const handleClick = () => { if (disabled || isRolling) return; setIsRolling(true); setTimeout(() => { onRoll(); setIsRolling(false); }, 600); };
    return (
        <button onClick={handleClick} disabled={disabled} className={`p-2 rounded-lg transition-colors ${disabled ? 'text-ink-dim/30 cursor-not-allowed' : 'text-ink-dim hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`} title="Randomizer: Pick a task (r)">
            <div className={`transition-transform duration-500 ${isRolling ? 'rotate-180' : ''}`}>{isRolling ? <Sparkles size={20} className="text-primary" /> : <Dices size={20} />}</div>
        </button>
    );
};

const CopyActionButton = ({ onClick, label, icon: Icon, className, title }: any) => {
    const [copied, setCopied] = React.useState(false);
    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            await onClick();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    return (
        <button onClick={handleClick} title={title} className={`${className} transition-all duration-300 ${copied ? 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : ''}`}>
            {copied ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
            {copied ? (label ? "Copied!" : "") : label}
        </button>
    );
};

const ActionButton = ({ onClick, icon: Icon, label, colorClass, title }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors group w-14 ${colorClass}`} title={title}>
        <div className="p-1 rounded-md group-hover:scale-110 transition-transform">
             <Icon size={20} strokeWidth={2} />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-tight opacity-70 leading-none">{label}</span>
    </button>
);

const NotebookPage: React.FC<NotebookPageProps> = (props) => {
    const { 
        pageIndex, todos, highlightedTodoId, isFocusMode, statusFilter, selectionMode, 
        settings, onClearFocus, onSetStatusFilter, onCopyMD, onExportVisible, onRollDice, canRoll, 
        onSelectAll, onToggleSelectionMode, onUpdateTodo, onHighlightTodo, onToggleSelect, selectedIds,
        onToggleTodo, onOpenModal, onToggleFocus, onDismissTodo, onCancelTodo, onDeleteTodo, onReenterTodo,
        onOpenBatchTag, onDeletePage
    } = props;
    
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

    // Retrieve density configuration
    const density = DENSITY_CONFIG[settings.density] || DENSITY_CONFIG.comfortable;
    const itemsPerPage = density.itemsPerPage;
    const lineHeight = density.lineHeight;

    // Scroll into view when highlight changes
    useEffect(() => { 
        if (highlightedTodoId && itemRefs.current[highlightedTodoId]) {
            itemRefs.current[highlightedTodoId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
        }
    }, [highlightedTodoId]);

    // Keyboard Navigation & Action Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            const applyAction = (action: (id: string) => void) => {
                if (selectionMode && selectedIds.size > 0) {
                    Array.from(selectedIds).forEach((id: string) => action(id));
                } else if (highlightedTodoId) {
                    action(highlightedTodoId as string);
                }
            };

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                if (e.metaKey || e.ctrlKey) return; // Let useKeyboardShortcuts handle Cmd/Ctrl + Arrow
                e.preventDefault(); 
                
                const currentIndex = todos.findIndex(t => t.id === highlightedTodoId);
                let nextIndex = 0;

                if (e.key === 'ArrowDown') {
                    nextIndex = currentIndex === -1 ? 0 : Math.min(todos.length - 1, currentIndex + 1);
                } else {
                    nextIndex = currentIndex === -1 ? todos.length - 1 : Math.max(0, currentIndex - 1);
                }

                const nextId = todos[nextIndex]?.id as string | undefined;
                if (nextId) {
                    onHighlightTodo(nextId);
                    
                    if (e.shiftKey) {
                        if (!selectionMode) onToggleSelectionMode();
                        
                        if (highlightedTodoId) {
                            const isNextSelected = selectedIds.has(nextId);
                            if (isNextSelected) {
                                if (selectedIds.has(highlightedTodoId)) onToggleSelect(highlightedTodoId);
                            } else {
                                if (!selectedIds.has(highlightedTodoId)) onToggleSelect(highlightedTodoId);
                                if (!selectedIds.has(nextId)) onToggleSelect(nextId);
                            }
                        }
                    }
                }
                return;
            }

            if (highlightedTodoId || (selectionMode && selectedIds.size > 0)) {
                const todo = highlightedTodoId ? todos.find(t => t.id === highlightedTodoId) : null;

                if (e.key === ' ') {
                    e.preventDefault();
                    applyAction(onToggleTodo);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        applyAction(onReenterTodo);
                    } else {
                        if (todo && (!selectionMode || selectedIds.size <= 1)) onOpenModal(todo);
                    }
                } else if (e.key.toLowerCase() === 'f' && !(e.metaKey || e.ctrlKey)) {
                    applyAction(onToggleFocus);
                } else if (e.key.toLowerCase() === 'd') {
                    applyAction(onDismissTodo);
                } else if (e.key.toLowerCase() === 'x') {
                    applyAction(onCancelTodo);
                } else if ((e.key === 'Backspace' || e.key === 'Delete') && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault(); 
                    applyAction(onDeleteTodo);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [todos, highlightedTodoId, onHighlightTodo, onToggleTodo, onOpenModal, onToggleFocus, onDismissTodo, onCancelTodo, onDeleteTodo, onReenterTodo, selectionMode, selectedIds, onToggleSelect, onToggleSelectionMode]);

    const stats = useMemo(() => { 
        let open=0, dismissed=0, done=0, cancelled=0; 
        todos.forEach(t => { if(t.isCompleted) done++; else if(t.isCancelled) cancelled++; else if(t.isDismissed) dismissed++; else open++; }); 
        return { open, dismissed, done, cancelled }; 
    }, [todos]);

    const handleTagRemove = (tag: string, todo: Todo) => {
         const newText = todo.text.replace(tag, '').replace(/\s+/, ' ').trim(); 
         onUpdateTodo(todo.id, newText, todo.notes);
    };

    const handleBatchCopyMD = async () => {
        const selected = todos.filter(t => selectedIds.has(t.id));
        if (selected.length === 0) return;
        await copyToClipboard(generateMarkdown(selected));
    };

    const handleBatchExport = () => {
        const selected = todos.filter(t => selectedIds.has(t.id));
        if (selected.length === 0) return;
        downloadJSON(selected, 'autofocus_selection.json');
    };

    // Calculate dynamic background for lines - APPLIED TO UL
    const bgStyle = {
        backgroundImage: `linear-gradient(transparent ${lineHeight - 1}px, var(--color-paper-line) ${lineHeight}px)`,
        backgroundSize: `100% ${lineHeight}px`,
        lineHeight: `${lineHeight}px`
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-paper shadow-xl relative rounded-lg border border-paper-line/50 theme-transition mb-8 min-h-[800px]">
            <div className={`h-16 rounded-t-lg border-b border-paper-line flex items-center px-8 pl-16 justify-between z-20 relative bg-paper/90 backdrop-blur-sm ${isFocusMode ? 'bg-amber-100/50 dark:bg-amber-900/20' : statusFilter ? 'bg-indigo-50/80 dark:bg-indigo-900/20' : ''}`}>
                <div className="flex items-center gap-4">
                    <span className={`text-lg font-bold tracking-tight font-mono flex items-center gap-3 ${isFocusMode ? 'text-amber-600' : statusFilter ? 'text-primary' : 'text-ink-dim'}`}>
                        {isFocusMode ? 'Focus Sheet' : statusFilter ? (statusFilter === 'dismissed' ? 'Review: Dismissed' : statusFilter === 'completed' ? 'Archive: Done' : 'Backlog: Open') : `Page ${pageIndex + 1}`}
                        
                        {!isFocusMode && !statusFilter && (
                             <button onClick={onDeletePage} className="p-1.5 text-ink-dim hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors group" title="Delete this page and all its tasks">
                                 <Trash2 size={14} className="opacity-50 group-hover:opacity-100" />
                             </button>
                        )}
                    </span>

                    {isFocusMode && todos.length > 0 && <button onClick={() => { if(confirm("Remove all tasks from Focus Mode?")) onClearFocus(); }} title="Clear all tasks from Focus mode" className="text-xs font-semibold text-amber-700 bg-amber-200/50 hover:bg-amber-200 dark:text-amber-400 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 px-2 py-1 rounded flex items-center gap-1 transition-colors"><Eraser size={12}/> Clear Focus</button>}
                    {statusFilter && <button onClick={() => onSetStatusFilter(null)} title="Clear current filter" className="text-xs font-semibold text-primary bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded flex items-center gap-1 transition-colors"><X size={12}/> Exit Filter</button>}
                    {(isFocusMode || statusFilter) && (
                        <div className="flex items-center gap-1 ml-2">
                            <CopyActionButton onClick={onCopyMD} label="Copy MD" icon={Clipboard} title="Copy as Markdown (for Obsidian)" className="text-xs font-semibold text-ink-dim hover:text-primary px-2 py-1 rounded flex items-center gap-1 transition-colors" />
                            <button onClick={onExportVisible} title="Download visible tasks as JSON" className="text-xs font-semibold text-ink-dim hover:text-primary px-2 py-1 rounded flex items-center gap-1 transition-colors"><Download size={12}/></button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <DiceRoller onRoll={onRollDice} disabled={!canRoll} />
                        {selectionMode ? (<button onClick={onSelectAll} title="Select All Visible Tasks" className="flex items-center gap-2 text-primary font-medium text-sm bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100"><ListChecks size={16}/> All</button>) : (<button onClick={onToggleSelectionMode} className="text-ink-dim hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors" title="Enter Selection Mode"><ListChecks size={20}/></button>)}
                    </div>
                    <div className="flex gap-2 text-xs font-semibold uppercase tracking-wide">
                        <button onClick={() => onSetStatusFilter(statusFilter === 'open' ? null : 'open')} title="Toggle Global Open View" className={`px-2 py-1 rounded-md border transition-all ${statusFilter === 'open' ? 'bg-primary text-white border-primary shadow-inner' : 'text-primary bg-primary-50 border-primary-100 hover:bg-primary-100'}`}>{stats.open} Open</button>
                        <button onClick={() => onSetStatusFilter(statusFilter === 'dismissed' ? null : 'dismissed')} title="Toggle Global Dismissed View" className={`px-2 py-1 rounded-md border transition-all ${statusFilter === 'dismissed' ? 'bg-amber-500 text-white border-amber-500 shadow-inner' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50'}`}>{stats.dismissed} Dism.</button>
                        <button onClick={() => onSetStatusFilter(statusFilter === 'completed' ? null : 'completed')} title="Toggle Global Done View" className={`px-2 py-1 rounded-md border transition-all ${statusFilter === 'completed' ? 'bg-emerald-500 text-white border-emerald-500 shadow-inner' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'}`}>{stats.done + stats.cancelled} Done</button>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 bottom-0 left-12 w-px bg-paper-margin z-10 opacity-40 pointer-events-none"></div>
            
            {/* Page Content Container - Block layout, no flex-grow needed as content pushes height */}
            <div className={`px-8 pb-14 rounded-b-lg relative z-0 ${isFocusMode ? 'bg-amber-50/30 dark:bg-amber-900/10' : statusFilter ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                 {isFocusMode && todos.length === 0 && (<div className="py-20 flex flex-col items-center justify-center text-ink-dim pointer-events-none"><Target size={48} className="mb-4 opacity-50" /><p className="text-lg font-medium">No tasks in focus.</p></div>)}
                 {statusFilter && todos.length === 0 && (<div className="py-20 flex flex-col items-center justify-center text-ink-dim pointer-events-none"><Filter size={48} className="mb-4 opacity-50" /><p className="text-lg font-medium">No tasks found in this filter.</p></div>)}
                
                {/* UL gets the background styles now, so lines stop exactly where items stop */}
                <ul className="pl-6" style={bgStyle}>
                    {todos.map((todo) => (
                        <TaskItem 
                            key={todo.id} 
                            todo={todo}
                            settings={settings}
                            itemRef={el => itemRefs.current[todo.id] = el}
                            highlightedTodoId={props.highlightedTodoId}
                            selectionMode={props.selectionMode}
                            selectedIds={props.selectedIds}
                            onToggleSelect={props.onToggleSelect}
                            onToggleFocus={props.onToggleFocus}
                            onToggleTodo={props.onToggleTodo}
                            onOpenModal={props.onOpenModal}
                            onTagClick={props.onTagClick}
                            onTagRemove={tag => handleTagRemove(tag, todo)}
                            onReenterTodo={props.onReenterTodo}
                            onDismissTodo={props.onDismissTodo}
                            onCancelTodo={props.onCancelTodo}
                            onDeleteTodo={props.onDeleteTodo}
                            statusFilter={statusFilter}
                            lineHeight={lineHeight}
                        />
                    ))}
                    {Array.from({ length: Math.max(0, itemsPerPage - todos.length) }).map((_, i) => <li key={`empty-${i}`} style={{height: lineHeight}} />)}
                </ul>
            </div>

            {selectionMode && selectedIds.size > 0 && (
                <div className="sticky bottom-6 z-[60] flex justify-center w-full pointer-events-none mb-4">
                    <div className="pointer-events-auto flex items-center p-2 bg-sidebar-bg/95 backdrop-blur-md border border-paper-line shadow-2xl rounded-2xl animate-in slide-in-from-bottom-4 fade-in duration-200 ring-1 ring-black/5">
                        <div className="px-4 text-xs font-bold text-ink-dim border-r border-paper-line/50 flex flex-col items-center justify-center mr-2">
                            <span className="text-2xl text-primary leading-none">{selectedIds.size}</span>
                            <span className="uppercase tracking-widest text-[9px] mt-1">Items</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            <ActionButton 
                                onClick={() => Array.from(selectedIds).forEach(id => onToggleTodo(id))} 
                                icon={Check} 
                                label="Done" 
                                title="Mark selected as Done"
                                colorClass="text-emerald-600" 
                            />
                            <ActionButton 
                                onClick={() => Array.from(selectedIds).forEach(id => onReenterTodo(id))} 
                                icon={Redo2} 
                                label="Re-Enter" 
                                title="Re-enter selected tasks"
                                colorClass="text-blue-500" 
                            />
                            <ActionButton 
                                onClick={() => Array.from(selectedIds).forEach(id => onToggleFocus(id))} 
                                icon={Pin} 
                                label="Focus" 
                                title="Toggle Focus for selected"
                                colorClass="text-amber-500" 
                            />
                            <ActionButton 
                                onClick={() => Array.from(selectedIds).forEach(id => onDismissTodo(id))} 
                                icon={Highlighter} 
                                label="Dismiss" 
                                title="Dismiss (Highlight) selected"
                                colorClass="text-yellow-600" 
                            />
                            <ActionButton 
                                onClick={() => Array.from(selectedIds).forEach(id => onCancelTodo(id))} 
                                icon={Ban} 
                                label="Cancel" 
                                title="Cancel (Abandon) selected"
                                colorClass="text-gray-500" 
                            />
                        </div>

                        <div className="w-px h-10 bg-paper-line/50 mx-2"></div>
                        
                        <div className="flex items-center gap-1">
                            <ActionButton 
                                onClick={handleBatchCopyMD} 
                                icon={Clipboard} 
                                label="Copy MD" 
                                title="Copy selected as Markdown"
                                colorClass="text-ink-dim group-hover:text-primary" 
                            />
                             <ActionButton 
                                onClick={onOpenBatchTag} 
                                icon={Tags} 
                                label="Tags" 
                                title="Add/Remove Tags for selected"
                                colorClass="text-ink-dim group-hover:text-primary" 
                            />
                             <ActionButton 
                                onClick={handleBatchExport} 
                                icon={FileJson} 
                                label="Export" 
                                title="Export selected as JSON"
                                colorClass="text-ink-dim group-hover:text-primary" 
                            />
                        </div>

                        <div className="w-px h-10 bg-paper-line/50 mx-2"></div>

                        <ActionButton 
                            onClick={() => { if(confirm(`Delete ${selectedIds.size} tasks?`)) Array.from(selectedIds).forEach(id => onDeleteTodo(id)); }} 
                            icon={Trash2} 
                            label="Delete" 
                            title="Delete selected permanently"
                            colorClass="text-red-500 group-hover:text-red-600" 
                        />

                        <button onClick={onToggleSelectionMode} className="ml-2 p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-ink rounded-xl transition-colors h-full flex flex-col justify-center items-center w-12" title="Exit Selection Mode (Esc)">
                            <X size={18} />
                            <span className="text-[9px] font-bold uppercase tracking-tight opacity-70 leading-none mt-1">Close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotebookPage;
