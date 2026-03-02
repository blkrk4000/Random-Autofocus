
import React, { useState, useEffect, useRef } from 'react';
import { Search, Clipboard, Download, X, ArrowRight } from 'lucide-react';
import { Settings as SettingsType } from './types';
import { DENSITY_CONFIG } from './constants';
import { generateId } from './services/storageService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';
import { useAppTimer } from './hooks/useAppTimer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTodoFiltering } from './hooks/useTodoFiltering';
import { useRandomizer } from './hooks/useRandomizer';
import { useTagOperations } from './hooks/useTagOperations';
import { generateMarkdown, downloadJSON, downloadText, parseImportFile, copyToClipboard } from './utils/exportUtils';
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

const App = () => {
    // -- Custom Hooks --
    const { 
        todos, addTodo, updateTodo, toggleTodo, dismissTodo, cancelTodo, deleteTodo, 
        toggleFocus, reenterTodo, clearFocus, undo, archiveCompleted, repaginate, importTodos, 
        getNextAvailablePageIndex, setTodos, deletePage, deleteAllTodos, historyLength
    } = useTodos();
    
    const { isDarkMode, setIsDarkMode, currentTheme, setCurrentTheme } = useTheme();

    // -- Local UI State --
    const [appSettings, setAppSettings] = useLocalStorage<SettingsType>('settings', { 
        density: 'comfortable', 
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

    // Handle Density Changes & Migration from 'fontSize'
    useEffect(() => {
        const rawSettings = appSettings as any;
        if (rawSettings.fontSize) {
             let newDensity: 'compact' | 'comfortable' | 'spacious' = 'comfortable';
             if (rawSettings.fontSize === 'compact') newDensity = 'compact';
             if (rawSettings.fontSize === 'large') newDensity = 'spacious';
             const { fontSize, ...rest } = rawSettings;
             setAppSettings({ ...rest, density: newDensity });
        }
    }, [appSettings.density]); 

    // Helper for density
    const currentDensityConfig = DENSITY_CONFIG[appSettings.density] || DENSITY_CONFIG.comfortable;
    const itemsPerPage = currentDensityConfig.itemsPerPage;

    // -- Navigation & View State --
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedTodoId, setHighlightedTodoId] = useState<string | null>(null);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isInputExpanded, setIsInputExpanded] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set<string>());
    
    // -- Modal States --
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
    const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
    const [isBatchTagModalOpen, setIsBatchTagModalOpen] = useState(false);
    const [isGoToPageOpen, setIsGoToPageOpen] = useState(false);
    const [isTimeUpOpen, setIsTimeUpOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<any | null>(null);

    // -- Derived State (Filtering) --
    const { totalPages, visibleTodos, pageCounts, tagCounts, allContexts } = useTodoFiltering({
        todos,
        searchQuery,
        statusFilter,
        isFocusMode,
        activePageIndex
    });

    // -- Randomizer Logic --
    const { handleRollDice } = useRandomizer({
        todos,
        isFocusMode,
        itemsPerPage,
        highlightedTodoId,
        setHighlightedTodoId,
        setActivePageIndex,
        setSearchQuery,
        setStatusFilter
    });

    // -- Tag Operations --
    const { handleRenameTag, handleDeleteTag, handleBatchAddTag, handleBatchRemoveTag } = useTagOperations(setTodos, selectedIds);

    // -- Timer Hook --
    const { timerState, setTimerState } = useAppTimer(appSettings, () => {
        if (appSettings.timerShowMessage !== false) setIsTimeUpOpen(true);
    });

    // -- Refs --
    const fileInputRef = useRef<HTMLInputElement>(null);

    // -- Helper Functions --
    const getDateString = () => new Date().toISOString().split('T')[0];

    const handleAddSubtasks = (tasks: string[]) => {
        const startPage = getNextAvailablePageIndex(itemsPerPage);
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
                if (merged.filter(x => x.pageIndex === currPage).length >= itemsPerPage) currPage++; 
                t.pageIndex = currPage; 
                merged.push(t); 
            }); 
            return merged; 
        });
    };

    const handleDeletePage = () => {
        if (confirm(`Delete Page ${activePageIndex + 1} and ALL tasks on it? This cannot be undone easily.`)) {
            deletePage(activePageIndex);
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
        if (confirm("Re-arrange all tasks to fill empty gaps based on current Density settings?")) {
            repaginate(itemsPerPage);
            alert("Pages compacted and reorganized!");
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

    // -- Smart Paste --
    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text');
        if (paste.includes('\n')) {
            e.preventDefault();
            const lines = paste.split(/\r?\n/);
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
    const isAnyModalOpen = isSettingsOpen || isTimerSettingsOpen || isTagManagerOpen || isBatchTagModalOpen || isGoToPageOpen || isTimeUpOpen || !!editingTodo;
    
    useKeyboardShortcuts({
        onNewTask: () => setIsInputExpanded(true),
        onToggleSidebar: () => setIsSidebarOpen(p => !p),
        onSearch: () => document.querySelector<HTMLInputElement>('input[placeholder="Search..."]')?.focus(),
        onRandom: handleRollDice,
        onGoToPage: () => setIsGoToPageOpen(true),
        onGoToFirstPage: () => setActivePageIndex(0),
        onGoToLastPage: () => setActivePageIndex(Math.max(0, totalPages - 1)),
        onToggleTimer: () => setTimerState(prev => ({...prev, isRunning: !prev.isRunning})),
        onToggleFocus: () => { setIsFocusMode(p => !p); setSearchQuery(''); setStatusFilter(null); },
        onUndo: undo,
        onEscape: () => { 
            setIsInputExpanded(false); 
            setSearchQuery('');
            setHighlightedTodoId(null);
        }
    }, isAnyModalOpen, [undo, setIsSidebarOpen, totalPages, handleRollDice, itemsPerPage, isAnyModalOpen]);

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
        downloadJSON(completed, `autofocus_archive_${getDateString()}.json`);
        archiveCompleted();
    };

    const handleToggleSelect = (id: string) => { setSelectedIds(prev => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
    const handleSelectAll = () => { if (selectedIds.size === visibleTodos.length) setSelectedIds(new Set()); else setSelectedIds(new Set(visibleTodos.map(t => t.id))); };

    // -- Effects --
    useEffect(() => { 
        // Ensure active page is valid when todos change or density changes
        if (activePageIndex >= totalPages) {
            setActivePageIndex(Math.max(0, totalPages - 1));
        }
    }, [totalPages, activePageIndex]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-app-bg font-sans text-ink transition-colors duration-300 theme-transition">
            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json,.txt,.md" />
            
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                settings={appSettings} 
                onUpdateSettings={setAppSettings} 
                onExport={() => downloadJSON(todos, `autofocus_backup_${getDateString()}.json`)} 
                onExportMD={() => downloadText(generateMarkdown(todos, "Full Export"), `autofocus_backup_${getDateString()}.md`)} 
                onImport={() => fileInputRef.current?.click()} 
                onArchive={handleArchive} 
                onArchiveMD={() => { 
                    downloadText(
                        generateMarkdown(todos.filter(t => t.isCompleted || t.isCancelled), "Archive"), 
                        `autofocus_archive_${getDateString()}.md`
                    ); 
                    archiveCompleted();
                }}
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

                <main className="flex-1 overflow-y-auto p-2 md:p-4 pb-72 bg-app-bg theme-transition relative">
                    {searchQuery ? (
                        <div className="w-full max-w-4xl mx-auto">
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
                            onReenterTodo={(id) => reenterTodo(id, itemsPerPage)} 
                            onToggleFocus={(id) => toggleFocus(id, itemsPerPage)} 
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
                        onAddTodo={(text) => addTodo(text, itemsPerPage)} 
                        nextPageIndex={getNextAvailablePageIndex(itemsPerPage)} 
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
