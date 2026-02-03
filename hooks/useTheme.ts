import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { THEMES } from '../themes';
import { Theme } from '../types';

export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('dark_mode', window.matchMedia('(prefers-color-scheme: dark)').matches);
    const [currentTheme, setCurrentTheme] = useLocalStorage<string>('theme', 'default');

    useEffect(() => {
        const root = document.documentElement;
        const theme: Theme = THEMES[currentTheme] || THEMES.default;
        const mode = isDarkMode ? 'dark' : 'light';
        const colors = theme.colors[mode];

        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        if (isDarkMode) root.classList.add('dark');
        else root.classList.remove('dark');
        
    }, [currentTheme, isDarkMode]);

    return { isDarkMode, setIsDarkMode, currentTheme, setCurrentTheme };
};