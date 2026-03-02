
import { useEffect } from 'react';

interface ShortcutHandlers {
    onNewTask: () => void;
    onToggleSidebar: () => void;
    onSearch: () => void;
    onRandom: () => void;
    onGoToPage: () => void;
    onGoToFirstPage: () => void;
    onGoToLastPage: () => void;
    onToggleTimer: () => void;
    onToggleFocus: () => void;
    onUndo: () => void;
    onEscape: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers, disabled: boolean = false, deps: any[] = []) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlOrMeta = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();
            const activeTag = document.activeElement?.tagName;
            const isInputActive = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

            // Escape should always work to close things
            if (e.key === 'Escape') { 
                handlers.onEscape();
                if (isInputActive && document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                return;
            }

            // If a modal is open or user is typing, disable other custom shortcuts
            if (disabled || isInputActive) {
                return;
            }

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
            
            // Search: Ctrl + F
            if (isCtrlOrMeta && key === 'f' && !e.shiftKey) { 
                e.preventDefault(); 
                handlers.onSearch(); 
            }
            
            // Randomizer: r
            if (key === 'r' && !isCtrlOrMeta && !e.shiftKey) { 
                e.preventDefault(); 
                handlers.onRandom(); 
            }
            
            // Go To Page: Ctrl + G
            if (isCtrlOrMeta && key === 'g') {
                e.preventDefault();
                handlers.onGoToPage();
            }

            // Go To First Page: Ctrl + ArrowUp
            if (isCtrlOrMeta && key === 'arrowup') {
                e.preventDefault();
                handlers.onGoToFirstPage();
            }

            // Go To Last Page: Ctrl + ArrowDown
            if (isCtrlOrMeta && key === 'arrowdown') {
                e.preventDefault();
                handlers.onGoToLastPage();
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
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, deps);
};
