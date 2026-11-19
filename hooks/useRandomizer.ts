import { useCallback } from 'react';
import { Todo } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface UseRandomizerProps {
    todos: Todo[];
    isFocusMode: boolean;
    itemsPerPage: number;
    setHighlightedTodoId: (id: string | null) => void;
    setActivePageIndex: (index: number) => void;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: string | null) => void;
}

const isOpen = (t: Todo) => !t.isCompleted && !t.isCancelled && !t.isDismissed;

export const useRandomizer = ({
    todos,
    isFocusMode,
    itemsPerPage,
    setHighlightedTodoId,
    setActivePageIndex,
    setSearchQuery,
    setStatusFilter
}: UseRandomizerProps) => {

    // Position des letzten Würfelwurfs: gespeichert, damit sie Neuladen und Esc überlebt.
    const [rollCursorId, setRollCursorId] = useLocalStorage<string | null>('roll_cursor', null);

    const handleRollDice = useCallback(() => {
        // --- FOCUS MODE LOGIC ---
        if (isFocusMode) {
            const focusTasks = todos.filter(t => t.isFocused && isOpen(t));
            
            if (focusTasks.length === 0) {
                alert("No open tasks in Focus Mode!");
                return;
            }
            
            const randomTask = focusTasks[Math.floor(Math.random() * focusTasks.length)];
            setHighlightedTodoId(randomTask.id);
            return;
        }

        // --- NORMAL NOTEBOOK LOGIC (MARK FORSTER) ---
        const openTodos = todos.filter(isOpen);
        if (openTodos.length === 0) {
            alert("No open tasks found in the notebook!");
            return;
        }

        // Aktuelle Position in der Gesamtliste (-1 = noch keine / Aufgabe nicht mehr vorhanden)
        const cursorIndex = rollCursorId ? todos.findIndex(t => t.id === rollCursorId) : -1;

        // Anzahl offener Aufgaben bis einschließlich der Position -> nur offene zählen als Schritte.
        // Ist die Positions-Aufgabe selbst nicht mehr offen, zählt der letzte offene Eintrag davor.
        let openUpToCursor = 0;
        for (let i = 0; i <= cursorIndex; i++) {
            if (isOpen(todos[i])) openUpToCursor++;
        }

        // Roll logic: Move forward X open steps (wraps around at the end of the list)
        const roll = Math.floor(Math.random() * itemsPerPage) + 1;
        const targetOpenIndex = (openUpToCursor - 1 + roll) % openTodos.length;
        const targetTask = openTodos[(targetOpenIndex + openTodos.length) % openTodos.length];

        // Reset view filters to show the result
        setSearchQuery('');
        setStatusFilter(null);
        setActivePageIndex(targetTask.pageIndex);
        setHighlightedTodoId(targetTask.id);
        setRollCursorId(targetTask.id);
    }, [todos, isFocusMode, itemsPerPage, rollCursorId, setRollCursorId, setHighlightedTodoId, setActivePageIndex, setSearchQuery, setStatusFilter]);

    return { handleRollDice };
};
