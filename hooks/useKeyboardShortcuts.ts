
import { useEffect } from 'react';

interface ShortcutHandlers {
    onNewTask: () => void;
    onToggleSidebar: () => void;
    onSearch: () => void;
    onRandom: () => void;
    onGoToPage: () => void;
    onToggleTimer: () => void;
    onToggleFocus: () => void;
    onUndo: () => void;
    onEscape: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers, deps: any[] = []) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlOrMeta = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();
            const activeTag = document.activeElement?.tagName;
            const isInputActive = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

            // New Task: Ctrl + N
            if (isCtrlOrMeta && key === 'n') { 
                e.preventDefault(); 
                handlers.onNewTask(); 
            }
            
            // Toggle Sidebar: Ctrl + B or Shift + Ctrl + S
            if (isCtrlOrMeta && ((e.shiftKey && key === 's') || key === 'b')) { 
                e.preventDefault(); 
                handlers.onToggleSidebar(); 
            }
            
            // Search: Ctrl + F or Ctrl + K
            if (isCtrlOrMeta && (key === 'f' || key === 'k')) { 
                e.preventDefault(); 
                handlers.onSearch(); 
            }
            
            // Randomizer: r (only if not typing)
            if (key === 'r' && !isCtrlOrMeta && !e.shiftKey && !isInputActive) { 
                e.preventDefault(); 
                handlers.onRandom(); 
            }
            
            // Go To Page: Ctrl + G
            if (isCtrlOrMeta && key === 'g') {
                e.preventDefault();
                handlers.onGoToPage();
            }

            // Toggle Timer: Ctrl + Shift + T
            if (isCtrlOrMeta && e.shiftKey && key === 't') { 
                e.preventDefault(); 
                handlers.onToggleTimer(); 
            }
            
            // Toggle Focus Mode: Ctrl + Shift + F
            if (isCtrlOrMeta && e.shiftKey && key === 'f') { 
                e.preventDefault(); 
                handlers.onToggleFocus(); 
            }
            
            // Undo: Ctrl + Z
            if (isCtrlOrMeta && key === 'z' && !e.shiftKey) { 
                e.preventDefault(); 
                handlers.onUndo(); 
            }

            // Escape
            if (e.key === 'Escape') { 
                handlers.onEscape();
                if (isInputActive && document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, deps);
};
