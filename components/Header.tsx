
import React, { useRef, useState } from 'react';
import { PanelLeft, Search, X, Layers, Settings, RotateCcw } from 'lucide-react';
import GlobalTimer from './GlobalTimer';
import ThemeMenu from './ThemeMenu';
import HelpModal from './HelpModal';
import { TimerState } from '../types';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (v: boolean) => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    isFocusMode: boolean;
    setIsFocusMode: (v: boolean) => void;
    setStatusFilter: (v: string | null) => void;
    timerState: TimerState;
    setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
    setIsSettingsOpen: (v: boolean) => void;
    onOpenTimerSettings: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (v: boolean) => void;
    currentTheme: string;
    setCurrentTheme: (v: string) => void;
    onUndo: () => void;
    canUndo: boolean;
    timerDefaultDuration: number;
}

const Header: React.FC<HeaderProps> = (props) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);

    return (
        <header className="h-16 bg-app-bg border-b border-paper-line/30 flex items-center px-2 sm:px-4 gap-2 flex-shrink-0 z-40 shadow-sm transition-colors flex-nowrap drag-region">
            
            {/* Left Group: Navigation & Undo */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button onClick={() => props.setIsSidebarOpen(!props.isSidebarOpen)} className="p-2 text-ink-dim hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0" title="Toggle Sidebar (Ctrl+B)">
                    <PanelLeft size={20} />
                </button>
                
                <button 
                    onClick={props.onUndo}
                    disabled={!props.canUndo}
                    className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${props.canUndo ? 'text-ink hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 opacity-100 scale-100' : 'text-ink-dim opacity-0 scale-75 pointer-events-none w-0 p-0 overflow-hidden'}`}
                    title="Undo Last Action (Ctrl+Z)"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Middle Group: Search (Flexible) */}
            <div className="relative flex-1 min-w-0 max-w-xl transition-all duration-300 group mx-1 sm:mx-2">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim pointer-events-none flex-shrink-0" />
                <input 
                    ref={searchInputRef} 
                    type="text" 
                    placeholder="Search..." 
                    value={props.searchQuery} 
                    onChange={e => props.setSearchQuery(e.target.value)} 
                    className="block w-full pl-10 pr-8 py-1.5 sm:py-2 border border-paper-line/50 rounded-lg bg-input-bg text-ink focus:ring-2 focus:ring-primary outline-none transition-all text-sm placeholder:text-ink-dim/50 truncate" 
                />
                {props.searchQuery && (
                    <button onClick={() => { props.setSearchQuery(''); searchInputRef.current?.focus(); }} title="Clear Search" className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                        <X size={14}/>
                    </button>
                )}
            </div>

            {/* Right Group: Tools & Settings */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button 
                    onClick={() => { props.setIsFocusMode(!props.isFocusMode); props.setSearchQuery(''); props.setStatusFilter(null); }} 
                    title="Toggle Focus Mode (f)" 
                    className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${props.isFocusMode ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800' : 'bg-paper text-ink border-paper-line/50 hover:border-primary/50'}`}
                >
                    <Layers size={18} />
                    <span className="hidden xl:inline">Focus</span>
                </button>
                
                <GlobalTimer 
                    timerState={props.timerState} 
                    setTimerState={props.setTimerState} 
                    defaultDuration={props.timerDefaultDuration} 
                    onOpenSettings={props.onOpenTimerSettings}
                />
                
                <div className="h-6 w-px bg-paper-line/30 mx-0.5 sm:mx-1"></div>

                <ThemeMenu 
                    isOpen={themeMenuOpen} 
                    setIsOpen={setThemeMenuOpen}
                    isDarkMode={props.isDarkMode}
                    setIsDarkMode={props.setIsDarkMode}
                    currentTheme={props.currentTheme}
                    setCurrentTheme={props.setCurrentTheme}
                />

                <button onClick={() => props.setIsSettingsOpen(true)} className="p-2 text-ink-dim hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors" title="Settings">
                    <Settings size={20} />
                </button>
                <HelpModal />
            </div>
        </header>
    );
};

export default Header;
