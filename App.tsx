
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Clipboard, Download, X, ArrowRight } from 'lucide-react';
import { Settings as SettingsType, TimerState } from './types';
import { ITEMS_PER_PAGE } from './constants';
import { getStorageKey, generateId } from './services/storageService';
import { playNotificationSound } from './services/soundService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';
import { generateMarkdown, downloadJSON, parseImportFile, copyToClipboard } from './utils/exportUtils';
import { getDemoData } from './utils/demoData';

import Sidebar from './components/Sidebar';
import NotebookPage from './components/NotebookPage';
import SettingsModal from './components/SettingsModal';
import TimerSettingsModal from './components/TimerSettingsModal';
import TaskDetailModal from './components/TaskDetailModal';
import TagManagerModal from './components/TagManagerModal';
import BatchTagModal from './components/BatchTagModal';
import GoToPageModal from './components/GoToPageModal';
import TimeUpModal from './components/TimeUpModal';
import Header from './components/Header';
import InputArea from './components/InputArea';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => { clearTimeout(handler); }; }, [value, delay]);
    return debouncedValue;
}

const App = () => {
    // -- Custom Hooks --
    const { 
        todos, addTodo, updateTodo, toggleTodo, dismissTodo, cancelTodo, deleteTodo, 
        toggleFocus, reenterTodo, clearFocus, undo, archiveCompleted, compactTodos, importTodos, 
        getNextAvailablePageIndex, setTodos, deletePage, deleteAllTodos, historyLength
    } = useTodos();
    
    const { isDarkMode, setIsDarkMode, currentTheme, setCurrentTheme } = useTheme();

    // -- Local UI State --
    const [appSettings, setAppSettings] = useLocalStorage<SettingsType>('settings', { 
        fontSize: 'normal', 
        fontFamily: 'sans',
        timerDefaultDuration: 25,
        timerBreakDuration: 5,
        timerMessage: "Great work! Take a break.",
        timerShowMessage: true,
        timerSound: 'sonar'
    });
    const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage<boolean>('sidebar_open', true);
    
    // Migration for old sound settings (Glass/Bell -> Sonar)
    useEffect(() => {
        if ((appSettings.timerSound as string) === 'glass' || (appSettings.timerSound as string) === 'bell') {
            setAppSettings(prev => ({ ...prev, timerSound: 'sonar' }));
        }
    }, [appSettings.timerSound, setAppSettings]);

    const [activePageIndex, setActivePageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedTodoId, setHighlightedTodoId] = useState<string | null>(null);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isInputExpanded, setIsInputExpanded] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set<string>());
    
    // Modal States
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
    const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
    const [isBatchTagModalOpen, setIsBatchTagModalOpen] = useState(false);
    const [isGoToPageOpen, setIsGoToPageOpen] = useState(false);
    const [isTimeUpOpen, setIsTimeUpOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<any | null>(null);

    // -- Timer State --
    const [timerState, setTimerState] = useState<TimerState>(() => {
        const defaultDuration = (appSettings.timerDefaultDuration || 25) * 60;
        const saved = localStorage.getItem(getStorageKey('global_timer'));
        if (saved) {
            try {
                const p = JSON.parse(saved);
                const elapsed = p.isRunning ? Math.floor((Date.now() - p.lastTick)/1000) : 0;
                const timeLeft = Math.max(0, p.timeLeft - elapsed);
                return { timeLeft, isRunning: p.isRunning && timeLeft > 0, initialDuration: p.initialDuration || defaultDuration };
            } catch { return { timeLeft: defaultDuration, isRunning: false, initialDuration: defaultDuration }; }
        }
        return { timeLeft: defaultDuration, isRunning: false, initialDuration: defaultDuration };
    });

    // -- Refs --
    const fileInputRef = useRef<HTMLInputElement>(null);

    // -- Derived Data --
    const totalPages = useMemo(() => todos.length === 0 ? 1 : Math.max(...todos.map(t => t.pageIndex)) + 1, [todos]);
    
    const visibleTodos = useMemo(() => { 
        const q = searchQuery.trim().toLowerCase(); 
        if (q) return todos.filter(t => t.text.toLowerCase().includes(q)); 
        if (statusFilter === 'dismissed') return todos.filter(t => t.isDismissed);
        if (statusFilter === 'completed') return todos.filter(t => t.isCompleted || t.isCancelled); 
        if (statusFilter === 'open') return todos.filter(t => !t.isCompleted && !t.isDismissed && !t.isCancelled);
        if (isFocusMode) return todos.filter(t => t.isFocused && !t.isCompleted && !t.isDismissed && !t.isCancelled); 
        return todos.filter(t => t.pageIndex === activePageIndex); 
    }, [todos, activePageIndex, searchQuery, isFocusMode, statusFilter]);
    
    const pageCounts = useMemo(() => { const c: Record<number, any> = {}; todos.forEach(t => { if (!c[t.pageIndex]) c[t.pageIndex] = { open: 0, dismissed: 0, done: 0, cancelled: 0 }; if (t.isCompleted) c[t.pageIndex].done++; else if(t.isCancelled) c[t.pageIndex].cancelled++; else if (t.isDismissed) c[t.pageIndex].dismissed++; else c[t.pageIndex].open++; }); return c; }, [todos]);
    const tagCounts = useMemo(() => { const c: Record<string, number> = {}; todos.forEach(t => { const matches = t.text.match(/[@#][\w-]+/g); if (matches) { matches.forEach(tag => { if (!c[tag]) c[tag] = 0; if (!t.isCompleted && !t.isDismissed && !t.isCancelled) c[tag]++; }); } }); return c; }, [todos]);
    const allContexts = useMemo(() => { const s = new Set<string>(); todos.forEach(t => t.text.match(/[@#][\w-]+/g)?.forEach(m => s.add(m))); return Array.from(s).sort(); }, [todos]);

    // -- Helper Functions --
    const handleAddSubtasks = (tasks: string[]) => {
        // "Manual" implementation of adding multiple tasks to handle smart paste
        const startPage = getNextAvailablePageIndex();
        const newTodos = tasks.map((t, i) => ({ 
            id: generateId(), 
            text: t, 
            notes: '', 
            isCompleted: false, 
            isFocused: false, 
            isCancelled: false, 
            isDismissed: false,
            pageIndex: startPage, 
            createdAt: Date.now()+i 
        }));
        
        setTodos(prev => { 
            const merged = [...prev]; 
            let currPage = startPage; 
            newTodos.forEach(t => { 
                if (merged.filter(x => x.pageIndex === currPage).length >= ITEMS_PER_PAGE) currPage++; 
                t.pageIndex = currPage; 
                merged.push(t); 
            }); 
            return merged; 
        });
    };

    // -- Actions --
    const handleRollDice = () => {
        // --- FOCUS MODE LOGIC ---
        // If we are in Focus Mode, we just pick a random task from the Focus Sheet.
        // The intricate page/line logic doesn't apply to this temporary list.
        if (isFocusMode) {
            const focusTasks = todos.filter(t => t.isFocused && !t.isCompleted && !t.isCancelled && !t.isDismissed);
            
            if (focusTasks.length === 0) {
                alert("No open tasks in Focus Mode!");
                return;
            }
            
            // Simple random selection for Focus Mode
            const randomTask = focusTasks[Math.floor(Math.random() * focusTasks.length)];
            setHighlightedTodoId(randomTask.id);
            return;
        }

        // --- NORMAL NOTEBOOK LOGIC (MARK FORSTER) ---
        // 1. Range is 1 to ITEMS_PER_PAGE (25).
        // 2. "Starting from the beginning... produce a number and move down... INCLUDE crossed off lines"
        // 3. "Circle back to the beginning... ignoring empty lines on the last page"
        // 4. "If I land on a crossed out line, I move to the next... 'Slide'"

        // Safety: Are there ANY open tasks?
        const hasOpenTasks = todos.some(t => !t.isCompleted && !t.isCancelled && !t.isDismissed);
        if (!hasOpenTasks) {
            alert("No open tasks found in the notebook!");
            return;
        }

        // 1. Determine Start Position (Index)
        // If a task is selected, we start from there. If not, start from -1 (beginning).
        let startIndex = -1;
        if (highlightedTodoId) {
            startIndex = todos.findIndex(t => t.id === highlightedTodoId);
        }
        if (startIndex === -1 && highlightedTodoId) {
             // Handle stale ID
             setHighlightedTodoId(null);
             startIndex = -1;
        }

        // 2. Generate Random Jump (1 - 25)
        const roll = Math.floor(Math.random() * ITEMS_PER_PAGE) + 1;

        // 3. Calculate Target (Modulo arithmetic handles the "Circle Back")
        // We add the roll to current index. This counts ALL lines (done or not).
        let targetIndex = (startIndex + roll) % todos.length;
        if (targetIndex < 0) targetIndex += todos.length;

        // 4. The "Slide"
        // If we land on a task that is Done/Dismissed/Cancelled, we increment until we hit an Open one.
        // We know an open task exists because of the check at the start.
        let safetyCounter = 0;
        while (
            (todos[targetIndex].isCompleted || 
             todos[targetIndex].isCancelled || 
             todos[targetIndex].isDismissed) && 
            safetyCounter < todos.length
        ) {
            targetIndex = (targetIndex + 1) % todos.length;
            safetyCounter++;
        }

        const targetTask = todos[targetIndex];

        // 5. Execute Move
        // Reset filters so the user sees the jump context
        setSearchQuery('');
        setStatusFilter(null);
        
        setActivePageIndex(targetTask.pageIndex);
        setHighlightedTodoId(targetTask.id);
    };

    const handleRenameTag = (oldTag: string, newTag: string) => {
        setTodos(prev => prev.map(t => {
            if (t.text.includes(oldTag)) {
                const newText = t.text.split(' ').map(word => word === oldTag ? newTag : word).join(' ');
                return { ...t, text: newText, modifiedAt: Date.now() };
            }
            return t;
        }));
    };

    const handleDeleteTag = (tag: string) => {
         setTodos(prev => prev.map(t => {
            if (t.text.includes(tag)) {
                const newText = t.text.split(' ').filter(word => word !== tag).join(' ');
                return { ...t, text: newText, modifiedAt: Date.now() };
            }
            return t;
        }));
    };

    const handleBatchAddTag = (tag: string) => { 
        if (!tag.trim()) return;
        setTodos(prev => prev.map(t => selectedIds.has(t.id) && !t.text.includes(tag) ? { ...t, text: (t.text + ' ' + tag).trim() } : t)); 
    };

    const handleBatchRemoveTag = (tag: string) => { 
        if (!tag.trim()) return;
        setTodos(prev => prev.map(t => selectedIds.has(t.id) ? { ...t, text: t.text.split(' ').filter(w => w !== tag).join(' ') } : t)); 
    };

    const handleDeletePage = () => {
        if (confirm(`Delete Page ${activePageIndex + 1} and ALL tasks on it? This cannot be undone easily.`)) {
            deletePage(activePageIndex);
            // Move to previous page or stay at 0
            setActivePageIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleResetAll = () => {
        if (confirm("⚠️ WARNING: This will delete ALL tasks and data permanently.\n\nAre you sure you want to reset the app?")) {
            if (confirm("Really? All data will be lost.")) {
                deleteAllTodos();
                setActivePageIndex(0);
                setIsSettingsOpen(false);
            }
        }
    };
    
    const handleLoadDemoData = () => {
        if (todos.length > 0) {
            if (!confirm("Load demo data? This will mix with your current tasks (unless you clear them first).")) return;
        }
        importTodos(getDemoData());
        setIsSettingsOpen(false);
        setActivePageIndex(0);
        alert("Demo data loaded!");
    };

    const handleCompactPages = () => {
        if (confirm("Re-arrange all tasks to fill empty gaps on pages? This will change page numbers for some tasks.")) {
            compactTodos();
            alert("Pages compacted!");
        }
    };
    
    const handleStartBreak = () => {
        setIsTimeUpOpen(false);
        const breakMins = appSettings.timerBreakDuration || 5;
        setTimerState({
            timeLeft: breakMins * 60,
            initialDuration: breakMins * 60,
            isRunning: true
        });
    };

    // -- Effects --
    useEffect(() => {
        localStorage.setItem(getStorageKey('global_timer'), JSON.stringify({ ...timerState, lastTick: Date.now() }));
        let interval: any = null;
        if (timerState.isRunning && timerState.timeLeft > 0) {
            interval = setInterval(() => {
                setTimerState(prev => {
                    // Logic to handle Time Up
                    if (prev.timeLeft <= 1) {
                         if (appSettings.timerShowMessage !== false) setIsTimeUpOpen(true);
                         playNotificationSound(appSettings.timerSound); // Play Configured Sound
                         return { ...prev, timeLeft: 0, isRunning: false };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerState.isRunning, timerState.timeLeft, appSettings.timerSound, appSettings.timerShowMessage]);

    useEffect(() => { 
        if (activePageIndex >= (todos.length === 0 ? 1 : Math.max(...todos.map(t => t.pageIndex)) + 1)) {
            setActivePageIndex(Math.max(0, (todos.length === 0 ? 1 : Math.max(...todos.map(t => t.pageIndex)) + 1) - 1));
        }
    }, [todos, activePageIndex]);

    // -- Smart Paste --
    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text');
        if (paste.includes('\n')) {
            e.preventDefault();
            const lines = paste.split(/\r?\n/);
            // Clean up common list prefixes (- [ ], *, 1., etc)
            const cleaned = lines.map(l => l.replace(/^(\s*[-*+]\s+(\[[xX ]\]\s+)?|\s*\d+\.\s+)/, '').trim()).filter(l => l);

            if (cleaned.length > 0) {
                if (confirm(`Detecting ${cleaned.length} items. Add them as separate tasks?`)) {
                    handleAddSubtasks(cleaned);
                    setIsInputExpanded(false);
                }
            }
        }
    };

    // -- Keyboard Shortcuts --
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlOrMeta = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();
            const activeTag = document.activeElement?.tagName;
            const isInputActive = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

            if (isCtrlOrMeta && key === 'n') { e.preventDefault(); setIsInputExpanded(true); }
            if (isCtrlOrMeta && ((e.shiftKey && key === 's') || key === 'b')) { e.preventDefault(); setIsSidebarOpen(p => !p); }
            if (isCtrlOrMeta && (key === 'f' || key === 'k')) { e.preventDefault(); document.querySelector<HTMLInputElement>('input[placeholder="Search..."]')?.focus(); }
            if (key === 'r' && !isCtrlOrMeta && !e.shiftKey) { e.preventDefault(); handleRollDice(); }
            
            // Go To Page Modal
            if (isCtrlOrMeta && key === 'g') {
                e.preventDefault();
                setIsGoToPageOpen(true);
            }

            if (isCtrlOrMeta && e.shiftKey && key === 't') { e.preventDefault(); setTimerState(prev => ({...prev, isRunning: !prev.isRunning})); }
            if (isCtrlOrMeta && e.shiftKey && key === 'f') { e.preventDefault(); setIsFocusMode(p => !p); setSearchQuery(''); setStatusFilter(null); }
            if (isCtrlOrMeta && key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }

            if (e.key === 'Escape') { 
                setIsInputExpanded(false); 
                setSearchQuery('');
                setHighlightedTodoId(null);
                if (isInputActive && document.activeElement instanceof HTMLElement) document.activeElement.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, setIsSidebarOpen, totalPages, handleRollDice]); 

    // -- Handlers --
    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => { 
        const file = e.target.files?.[0]; if (!file) return; 
        try {
            const data = await parseImportFile(file);
            if (Array.isArray(data)) {
                importTodos(data);
                alert(`Imported tasks successfully.`);
            }
        } catch (err) {
            alert("Import failed: " + err);
        }
        e.target.value = '';
    };

    const handleArchive = () => {
        const completed = todos.filter(t => t.isCompleted || t.isCancelled);
        if (completed.length === 0) return alert("No completed/cancelled tasks to archive.");
        if (!confirm(`Archive ${completed.length} tasks?`)) return;
        downloadJSON(completed, "autofocus_archive.json");
        archiveCompleted();
    };

    const handleToggleSelect = (id: string) => { setSelectedIds(prev => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
    const handleSelectAll = () => { if (selectedIds.size === visibleTodos.length) setSelectedIds(new Set()); else setSelectedIds(new Set(visibleTodos.map(t => t.id))); };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-app-bg font-sans text-ink transition-colors duration-300 theme-transition">
            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json,.txt,.md" />
            
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                settings={appSettings} 
                onUpdateSettings={setAppSettings} 
                onExport={() => downloadJSON(todos, "autofocus_backup.json")} 
                onExportMD={async () => { await copyToClipboard(generateMarkdown(todos, "Full Export")); }} 
                onImport={() => fileInputRef.current?.click()} 
                onArchive={handleArchive} 
                onArchiveMD={async () => { await copyToClipboard(generateMarkdown(todos.filter(t => t.isCompleted || t.isCancelled), "Archive")); }}
                onResetAll={handleResetAll}
                onLoadDemoData={handleLoadDemoData}
                onCompactPages={handleCompactPages}
            />

            <TimerSettingsModal
                isOpen={isTimerSettingsOpen}
                onClose={() => setIsTimerSettingsOpen(false)}
                settings={appSettings}
                onUpdateSettings={setAppSettings}
            />

            <TagManagerModal
                isOpen={isTagManagerOpen}
                onClose={() => setIsTagManagerOpen(false)}
                tagCounts={tagCounts}
                onRenameTag={handleRenameTag}
                onDeleteTag={handleDeleteTag}
            />

            <BatchTagModal 
                isOpen={isBatchTagModalOpen}
                onClose={() => setIsBatchTagModalOpen(false)}
                onAddTag={handleBatchAddTag}
                onRemoveTag={handleBatchRemoveTag}
            />

            <GoToPageModal
                isOpen={isGoToPageOpen}
                onClose={() => setIsGoToPageOpen(false)}
                totalPages={totalPages}
                onGo={(i) => { setActivePageIndex(i); setIsFocusMode(false); setSearchQuery(''); }}
            />

            <TimeUpModal 
                isOpen={isTimeUpOpen} 
                onClose={() => setIsTimeUpOpen(false)} 
                message={appSettings.timerMessage} 
                onStartBreak={handleStartBreak}
                breakDuration={appSettings.timerBreakDuration || 5}
            />
            
            <TaskDetailModal 
                isOpen={!!editingTodo} 
                todo={editingTodo} 
                onClose={() => setEditingTodo(null)} 
                onSave={updateTodo} 
                allTags={allContexts} 
            />

            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-sidebar-bg transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden`}>
                <div className="w-64 h-full">
                    <Sidebar 
                        totalPages={totalPages} 
                        activePageIndex={isFocusMode ? -1 : activePageIndex} 
                        onPageSelect={i => { 
                            if (typeof i === 'string') { setSearchQuery(i); } 
                            else { setActivePageIndex(i as number); setIsFocusMode(false); setSearchQuery(''); } 
                        }} 
                        pageCounts={pageCounts} 
                        tagCounts={tagCounts} 
                        onOpenTagManager={() => setIsTagManagerOpen(true)} 
                    />
                </div>
            </div>
            
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isFocusMode={isFocusMode}
                    setIsFocusMode={setIsFocusMode}
                    setStatusFilter={(s) => { setStatusFilter(s); if(s) { setIsFocusMode(false); setSearchQuery(''); } }}
                    timerState={timerState}
                    setTimerState={setTimerState}
                    setIsSettingsOpen={setIsSettingsOpen}
                    onOpenTimerSettings={() => setIsTimerSettingsOpen(true)}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    currentTheme={currentTheme}
                    setCurrentTheme={setCurrentTheme}
                    onUndo={undo}
                    canUndo={historyLength > 0}
                    timerDefaultDuration={appSettings.timerDefaultDuration || 25}
                />

                <main className="flex-1 overflow-y-auto p-2 md:p-4 pb-72 bg-app-bg flex justify-center theme-transition relative">
                    {searchQuery ? (
                        <div className="w-full max-w-4xl">
                            <div className="flex justify-between mb-6">
                                <h2 className="text-xl font-bold flex gap-2 text-ink"><Search /> Search Results</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => copyToClipboard(generateMarkdown(visibleTodos, 'Search Results'))} className="flex gap-1 items-center bg-paper-line/20 text-ink px-3 py-1 rounded text-sm hover:bg-paper-line/30"><Clipboard size={16}/> Copy MD</button>
                                    <button onClick={() => downloadJSON(visibleTodos, 'search_results.json')} className="flex gap-1 items-center bg-paper-line/20 text-ink px-3 py-1 rounded text-sm hover:bg-paper-line/30"><Download size={16}/> Export</button>
                                    <button onClick={() => setSearchQuery('')} className="flex gap-1 items-center bg-paper-line/20 text-ink px-3 py-1 rounded text-sm"><X size={16}/> Close</button>
                                </div>
                            </div>
                            {!visibleTodos.length ? <div className="text-center p-8 text-ink-dim">No matches.</div> : <div className="space-y-3">{visibleTodos.map(t => (<div key={t.id} onClick={() => { setSearchQuery(''); setActivePageIndex(t.pageIndex); setHighlightedTodoId(t.id); }} className="bg-paper p-4 rounded-lg shadow-sm border border-paper-line flex justify-between cursor-pointer hover:border-primary group"><div className="flex gap-4 items-center"><span className="bg-black/5 dark:bg-white/5 px-2 py-1 text-xs font-bold rounded text-ink-dim">PAGE {t.pageIndex+1}</span><span className={`text-lg font-medium text-ink ${t.isCompleted?'line-through opacity-50':''}`}>{t.text}</span></div><ArrowRight size={20} className="text-paper-line group-hover:text-primary"/></div>))}</div>}
                        </div>
                    ) : (
                        <NotebookPage 
                            pageIndex={activePageIndex} 
                            todos={visibleTodos} 
                            highlightedTodoId={highlightedTodoId} 
                            isFocusMode={isFocusMode} 
                            onToggleTodo={toggleTodo} 
                            onDeleteTodo={deleteTodo} 
                            onDismissTodo={dismissTodo} 
                            onReenterTodo={reenterTodo} // Pass direct callback
                            onToggleFocus={toggleFocus} 
                            onUpdateTodo={updateTodo} 
                            onTagClick={t => {setSearchQuery(t);}} 
                            onOpenModal={setEditingTodo} 
                            selectionMode={selectionMode} 
                            selectedIds={selectedIds} 
                            onToggleSelect={handleToggleSelect} 
                            onSelectAll={handleSelectAll} 
                            onToggleSelectionMode={() => { if (selectionMode) setSelectedIds(new Set()); setSelectionMode(!selectionMode); }} 
                            onClearFocus={clearFocus} 
                            onRollDice={handleRollDice} 
                            canRoll={isFocusMode 
                                ? todos.some(t => t.isFocused && !t.isCompleted && !t.isDismissed) 
                                : todos.some(t => !t.isCompleted && !t.isCancelled && !t.isDismissed)
                            } 
                            settings={appSettings} 
                            statusFilter={statusFilter} 
                            onSetStatusFilter={(s) => { setStatusFilter(s); if(s) { setIsFocusMode(false); setSearchQuery(''); } }} 
                            onExportVisible={() => downloadJSON(visibleTodos, (statusFilter || 'view') + '.json')} 
                            onCopyMD={() => copyToClipboard(generateMarkdown(visibleTodos, "View"))} 
                            onCancelTodo={cancelTodo}
                            onHighlightTodo={setHighlightedTodoId}
                            onOpenBatchTag={() => setIsBatchTagModalOpen(true)}
                            onDeletePage={handleDeletePage}
                        />
                    )}
                </main>

                {/* Hide InputArea when selection mode is active */}
                {!selectionMode && (
                    <InputArea 
                        onAddTodo={addTodo} 
                        nextPageIndex={getNextAvailablePageIndex()} 
                        isExpanded={isInputExpanded} 
                        setIsExpanded={setIsInputExpanded} 
                        onPaste={handlePaste}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
