import { useState, useCallback } from 'react';
import { Todo } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../services/storageService';
import { ITEMS_PER_PAGE } from '../constants';

export const useTodos = () => {
    const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
    const [history, setHistory] = useState<Todo[][]>([]);

    const saveHistory = useCallback(() => {
        setHistory(prev => {
            const h = [...prev, todos];
            return h.length > 50 ? h.slice(1) : h;
        });
    }, [todos]);

    const undo = useCallback(() => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setHistory(h => h.slice(0, -1));
        setTodos(prev);
    }, [history, setTodos]);

    const getNextAvailablePageIndex = useCallback(() => {
        const totalPages = todos.length === 0 ? 1 : Math.max(...todos.map(t => t.pageIndex)) + 1;
        if (todos.length === 0) return 0;
        const lastIdx = totalPages - 1;
        const count = todos.filter(t => t.pageIndex === lastIdx).length;
        return count < ITEMS_PER_PAGE ? lastIdx : lastIdx + 1;
    }, [todos]);

    const addTodo = useCallback((text: string) => {
        if (!text.trim()) return;
        saveHistory();
        const newTodo: Todo = {
            id: generateId(),
            text: text.trim(),
            notes: '',
            isCompleted: false,
            isFocused: false,
            isCancelled: false,
            isDismissed: false,
            pageIndex: getNextAvailablePageIndex(),
            createdAt: Date.now()
        };
        setTodos(p => [...p, newTodo]);
    }, [saveHistory, getNextAvailablePageIndex, setTodos]);

    const updateTodo = useCallback((id: string, text: string, notes: string) => {
        saveHistory();
        setTodos(p => p.map(t => t.id === id ? { ...t, text: text.trim(), notes: notes, modifiedAt: Date.now() } : t));
    }, [saveHistory, setTodos]);

    const toggleTodo = useCallback((id: string) => {
        saveHistory();
        setTodos(p => p.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted, isCancelled: false, isFocused: false } : t));
    }, [saveHistory, setTodos]);

    const dismissTodo = useCallback((id: string) => {
        saveHistory();
        setTodos(p => p.map(t => t.id === id ? { ...t, isDismissed: !t.isDismissed, isFocused: false } : t));
    }, [saveHistory, setTodos]);

    const cancelTodo = useCallback((id: string) => {
        saveHistory();
        setTodos(p => p.map(t => t.id === id ? { ...t, isCancelled: !t.isCancelled, isCompleted: false, isFocused: false } : t));
    }, [saveHistory, setTodos]);

    const deleteTodo = useCallback((id: string) => {
        saveHistory();
        setTodos(p => p.filter(t => t.id !== id));
    }, [saveHistory, setTodos]);

    const toggleFocus = useCallback((id: string) => {
        const t = todos.find(i => i.id === id);
        if (!t) return;
        
        // Validation logic for focus limit could be here, but we'll return a boolean or handle UI elsewhere
        if (!t.isFocused) {
            const count = todos.filter(x => x.isFocused && !x.isCompleted && !x.isDismissed && !x.isCancelled).length;
            if (count >= ITEMS_PER_PAGE) {
                alert(`Focus Sheet is full (${ITEMS_PER_PAGE} tasks max).`);
                return;
            }
        }
        
        saveHistory();
        setTodos(p => p.map(x => {
            if (x.id !== id) return x;
            const f = !x.isFocused;
            return { ...x, isFocused: f, isDismissed: f ? false : x.isDismissed };
        }));
    }, [todos, saveHistory, setTodos]);

    const reenterTodo = useCallback((id: string) => {
        const task = todos.find(t => t.id === id);
        if (!task || task.isCompleted || task.isDismissed || task.isCancelled) return;
        saveHistory();
        
        let nextPageIdx = 0;
        if (todos.length > 0) {
            const lastPageIdx = Math.max(...todos.map(t => t.pageIndex));
            const countOnLastPage = todos.filter(t => t.pageIndex === lastPageIdx).length;
            nextPageIdx = countOnLastPage < ITEMS_PER_PAGE ? lastPageIdx : lastPageIdx + 1;
        }

        const newTodo: Todo = {
            id: generateId(),
            text: task.text,
            notes: task.notes,
            isCompleted: false,
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: nextPageIdx,
            createdAt: Date.now()
        };

        setTodos(prev => [...prev.map(t => t.id === id ? { ...t, isCompleted: true, isFocused: false } : t), newTodo]);
    }, [todos, saveHistory, setTodos]);

    const clearFocus = useCallback(() => {
        saveHistory();
        setTodos(p => p.map(t => ({ ...t, isFocused: false })));
    }, [saveHistory, setTodos]);

    const archiveCompleted = useCallback(() => {
        saveHistory();
        setTodos(prev => prev.filter(t => !t.isCompleted && !t.isCancelled));
    }, [saveHistory, setTodos]);

    const importTodos = useCallback((newTodos: Todo[]) => {
        saveHistory();
        setTodos(p => {
             const exist = new Set(p.map(t => t.id));
             const unique = newTodos.filter(t => !exist.has(t.id));
             return [...p, ...unique];
        });
    }, [saveHistory, setTodos]);

    // NEW: Delete an entire page and shift subsequent pages down
    const deletePage = useCallback((pageIndex: number) => {
        saveHistory();
        setTodos(prev => {
            // 1. Filter out tasks on this page
            const remaining = prev.filter(t => t.pageIndex !== pageIndex);
            
            // 2. Shift indices for subsequent pages (e.g. Page 5 becomes Page 4)
            return remaining.map(t => ({
                ...t,
                pageIndex: t.pageIndex > pageIndex ? t.pageIndex - 1 : t.pageIndex
            }));
        });
    }, [saveHistory, setTodos]);

    // NEW: Delete EVERYTHING
    const deleteAllTodos = useCallback(() => {
        saveHistory();
        setTodos([]);
    }, [saveHistory, setTodos]);

    return {
        todos,
        setTodos, // Exposed for raw manipulation if absolutely needed, but prefer handlers
        addTodo,
        updateTodo,
        toggleTodo,
        dismissTodo,
        cancelTodo,
        deleteTodo,
        toggleFocus,
        reenterTodo,
        clearFocus,
        undo,
        archiveCompleted,
        importTodos,
        deletePage,     // New export
        deleteAllTodos, // New export
        historyLength: history.length,
        getNextAvailablePageIndex
    };
};