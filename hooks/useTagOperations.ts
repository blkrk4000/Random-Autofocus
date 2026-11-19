
import { useCallback } from 'react';
import { Todo } from '../types';

export const useTagOperations = (
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
    selectedIds: Set<string>,
    saveHistory: () => void
) => {

    const handleRenameTag = useCallback((oldTag: string, newTag: string) => {
        saveHistory();
        setTodos(prev => prev.map(t => {
            if (t.text.includes(oldTag)) {
                // Simple replace might be dangerous if tag is substring of another word
                // Splitting by space ensures we match whole words (mostly)
                const newText = t.text.split(' ').map(word => word === oldTag ? newTag : word).join(' ');
                return { ...t, text: newText, modifiedAt: Date.now() };
            }
            return t;
        }));
    }, [setTodos, saveHistory]);

    const handleDeleteTag = useCallback((tag: string) => {
         saveHistory();
         setTodos(prev => prev.map(t => {
            if (t.text.includes(tag)) {
                const newText = t.text.split(' ').filter(word => word !== tag).join(' ');
                return { ...t, text: newText, modifiedAt: Date.now() };
            }
            return t;
        }));
    }, [setTodos, saveHistory]);

    const handleBatchAddTag = useCallback((tag: string) => { 
        if (!tag.trim()) return;
        saveHistory();
        setTodos(prev => prev.map(t => 
            selectedIds.has(t.id) && !t.text.includes(tag) 
                ? { ...t, text: (t.text + ' ' + tag).trim() } 
                : t
        )); 
    }, [setTodos, selectedIds, saveHistory]);

    const handleBatchRemoveTag = useCallback((tag: string) => { 
        if (!tag.trim()) return;
        saveHistory();
        setTodos(prev => prev.map(t => 
            selectedIds.has(t.id) 
                ? { ...t, text: t.text.split(' ').filter(w => w !== tag).join(' ') } 
                : t
        )); 
    }, [setTodos, selectedIds, saveHistory]);

    return {
        handleRenameTag,
        handleDeleteTag,
        handleBatchAddTag,
        handleBatchRemoveTag
    };
};
