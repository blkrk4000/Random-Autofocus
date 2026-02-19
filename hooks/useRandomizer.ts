
import { useCallback } from 'react';
import { Todo } from '../types';

interface UseRandomizerProps {
    todos: Todo[];
    isFocusMode: boolean;
    itemsPerPage: number;
    highlightedTodoId: string | null;
    setHighlightedTodoId: (id: string | null) => void;
    setActivePageIndex: (index: number) => void;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: string | null) => void;
}

export const useRandomizer = ({
    todos,
    isFocusMode,
    itemsPerPage,
    highlightedTodoId,
    setHighlightedTodoId,
    setActivePageIndex,
    setSearchQuery,
    setStatusFilter
}: UseRandomizerProps) => {

    const handleRollDice = useCallback(() => {
        // --- FOCUS MODE LOGIC ---
        if (isFocusMode) {
            const focusTasks = todos.filter(t => t.isFocused && !t.isCompleted && !t.isCancelled && !t.isDismissed);
            
            if (focusTasks.length === 0) {
                alert("No open tasks in Focus Mode!");
                return;
            }
            
            const randomTask = focusTasks[Math.floor(Math.random() * focusTasks.length)];
            setHighlightedTodoId(randomTask.id);
            return;
        }

        // --- NORMAL NOTEBOOK LOGIC (MARK FORSTER) ---
        const hasOpenTasks = todos.some(t => !t.isCompleted && !t.isCancelled && !t.isDismissed);
        if (!hasOpenTasks) {
            alert("No open tasks found in the notebook!");
            return;
        }

        let startIndex = -1;
        if (highlightedTodoId) {
            startIndex = todos.findIndex(t => t.id === highlightedTodoId);
        }
        // If highlighted ID not found (deleted/filtered), reset start index
        if (startIndex === -1 && highlightedTodoId) {
             setHighlightedTodoId(null);
             startIndex = -1;
        }

        // Roll logic: Move forward X steps
        const roll = Math.floor(Math.random() * itemsPerPage) + 1;

        let targetIndex = (startIndex + roll) % todos.length;
        if (targetIndex < 0) targetIndex += todos.length;

        // Skip over completed/cancelled/dismissed tasks
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

        // Reset view filters to show the result
        setSearchQuery('');
        setStatusFilter(null);
        setActivePageIndex(targetTask.pageIndex);
        setHighlightedTodoId(targetTask.id);
    }, [todos, isFocusMode, itemsPerPage, highlightedTodoId, setHighlightedTodoId, setActivePageIndex, setSearchQuery, setStatusFilter]);

    return { handleRollDice };
};
