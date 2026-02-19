
import { useMemo } from 'react';
import { Todo } from '../types';

interface UseTodoFilteringProps {
    todos: Todo[];
    searchQuery: string;
    statusFilter: string | null;
    isFocusMode: boolean;
    activePageIndex: number;
}

export const useTodoFiltering = ({ 
    todos, 
    searchQuery, 
    statusFilter, 
    isFocusMode, 
    activePageIndex 
}: UseTodoFilteringProps) => {

    // Calculate total pages
    const totalPages = useMemo(() => 
        todos.length === 0 ? 1 : Math.max(...todos.map(t => t.pageIndex)) + 1, 
    [todos]);
    
    // Filter visible todos
    const visibleTodos = useMemo(() => { 
        const q = searchQuery.trim().toLowerCase(); 
        
        // 1. Search takes priority
        if (q) return todos.filter(t => t.text.toLowerCase().includes(q)); 
        
        // 2. Global Status Filters
        if (statusFilter === 'dismissed') return todos.filter(t => t.isDismissed);
        if (statusFilter === 'completed') return todos.filter(t => t.isCompleted || t.isCancelled); 
        if (statusFilter === 'open') return todos.filter(t => !t.isCompleted && !t.isDismissed && !t.isCancelled);
        
        // 3. Focus Mode
        if (isFocusMode) return todos.filter(t => t.isFocused && !t.isCompleted && !t.isDismissed && !t.isCancelled); 
        
        // 4. Default Page View
        return todos.filter(t => t.pageIndex === activePageIndex); 
    }, [todos, activePageIndex, searchQuery, isFocusMode, statusFilter]);
    
    // Calculate Stats per Page
    const pageCounts = useMemo(() => { 
        const c: Record<number, any> = {}; 
        todos.forEach(t => { 
            if (!c[t.pageIndex]) c[t.pageIndex] = { open: 0, dismissed: 0, done: 0, cancelled: 0 }; 
            if (t.isCompleted) c[t.pageIndex].done++; 
            else if(t.isCancelled) c[t.pageIndex].cancelled++; 
            else if (t.isDismissed) c[t.pageIndex].dismissed++; 
            else c[t.pageIndex].open++; 
        }); 
        return c; 
    }, [todos]);

    // Calculate Tag Counts (Contexts @ and Projects #)
    const tagCounts = useMemo(() => { 
        const c: Record<string, number> = {}; 
        todos.forEach(t => { 
            const matches = t.text.match(/[@#][\w-]+/g); 
            if (matches) { 
                matches.forEach(tag => { 
                    if (!c[tag]) c[tag] = 0; 
                    if (!t.isCompleted && !t.isDismissed && !t.isCancelled) c[tag]++; 
                }); 
            } 
        }); 
        return c; 
    }, [todos]);

    // Extract all unique context/project strings for autocomplete
    const allContexts = useMemo(() => { 
        const s = new Set<string>(); 
        todos.forEach(t => t.text.match(/[@#][\w-]+/g)?.forEach(m => s.add(m))); 
        return Array.from(s).sort(); 
    }, [todos]);

    return {
        totalPages,
        visibleTodos,
        pageCounts,
        tagCounts,
        allContexts
    };
};
