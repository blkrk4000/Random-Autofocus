
import React, { useMemo } from 'react';
import { Palette, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { THEMES } from '../themes';

interface ThemeMenuProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    isDarkMode: boolean;
    setIsDarkMode: (v: boolean) => void;
    currentTheme: string;
    setCurrentTheme: (v: string) => void;
}

const ThemeMenu: React.FC<ThemeMenuProps> = ({ isOpen, setIsOpen, isDarkMode, setIsDarkMode, currentTheme, setCurrentTheme }) => {
    
    // Sort themes alphabetically by name for display
    const sortedThemes = useMemo(() => {
        return Object.entries(THEMES).sort(([, a], [, b]) => a.name.localeCompare(b.name));
    }, []);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} title="Change Theme & Appearance" className="p-2 text-ink-dim hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors"><Palette size={20} /></button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-paper rounded-xl shadow-xl border border-paper-line z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-paper-line flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-dim uppercase px-2">Appearance</span>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-ink-dim hover:text-primary transition-colors">
                            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                    <div className="p-1 max-h-80 overflow-y-auto">
                        {sortedThemes.map(([key, theme]) => (
                            <button key={key} onClick={() => { setCurrentTheme(key); setIsOpen(false); }} title={`Select ${theme.name} Theme`} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between group transition-colors ${currentTheme === key ? 'bg-primary-50 text-primary' : 'text-ink hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-paper-line/50" style={{background: theme.colors[isDarkMode ? 'dark' : 'light']['--color-app-bg']}}></div>
                                    <span>{theme.name}</span>
                                </div>
                                {currentTheme === key && <CheckCircle2 size={14} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeMenu;
