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

    // Mehrfach-Tab-Schutz: Änderungen aus einem anderen Tab/Fenster übernehmen,
    // damit sich offene Tabs nicht gegenseitig mit altem Stand überschreiben.
    // Das "storage"-Event feuert nur in den ANDEREN Tabs und nur bei geändertem Wert.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.storageArea !== window.localStorage || e.key !== key || e.newValue === null) return;
            try {
                setStoredValue(JSON.parse(e.newValue));
            } catch (error) {
                console.error(error);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [key]);

    return [storedValue, setStoredValue];
}
