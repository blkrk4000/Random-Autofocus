
import { useState, useEffect } from 'react';
import { TimerState, Settings } from '../types';
import { getStorageKey } from '../services/storageService';
import { playNotificationSound } from '../services/soundService';

export const useAppTimer = (
    settings: Settings, 
    onTimeUp: () => void
) => {
    const [timerState, setTimerState] = useState<TimerState>(() => {
        const defaultDuration = (settings.timerDefaultDuration || 25) * 60;
        const saved = localStorage.getItem(getStorageKey('global_timer'));
        if (saved) {
            try {
                const p = JSON.parse(saved);
                const elapsed = p.isRunning ? Math.floor((Date.now() - p.lastTick)/1000) : 0;
                const timeLeft = Math.max(0, p.timeLeft - elapsed);
                return { timeLeft, isRunning: p.isRunning && timeLeft > 0, initialDuration: p.initialDuration || defaultDuration };
            } catch { return { timeLeft: defaultDuration, isRunning: false, initialDuration: defaultDuration }; }
        }
        return { timeLeft: defaultDuration, isRunning: false, initialDuration: defaultDuration };
    });

    useEffect(() => {
        localStorage.setItem(getStorageKey('global_timer'), JSON.stringify({ ...timerState, lastTick: Date.now() }));
        
        let interval: any = null;
        if (timerState.isRunning && timerState.timeLeft > 0) {
            interval = setInterval(() => {
                setTimerState(prev => {
                    // Logic to handle Time Up
                    if (prev.timeLeft <= 1) {
                         onTimeUp(); // Callback to parent
                         playNotificationSound(settings.timerSound);
                         return { ...prev, timeLeft: 0, isRunning: false };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerState.isRunning, timerState.timeLeft, settings.timerSound, onTimeUp]);

    return { timerState, setTimerState };
};
