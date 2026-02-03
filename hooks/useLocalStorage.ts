import React, { useState, useEffect } from 'react';
import { getStorageKey } from '../services/storageService';

export function useLocalStorage<T>(keySuffix: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const key = getStorageKey(keySuffix);
    
    // Lazy initialization to prevent hydration mismatch and slow reads
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}