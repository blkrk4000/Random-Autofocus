import { useState, useEffect, useRef } from 'react';
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

    // Aktuelle Callbacks/Einstellungen in Refs, damit der Timer-Effekt nicht neu startet
    const onTimeUpRef = useRef(onTimeUp);
    const soundRef = useRef(settings.timerSound);
    onTimeUpRef.current = onTimeUp;
    soundRef.current = settings.timerSound;

    // Zustand speichern (inkl. Zeitstempel, damit nach einem Neuladen die Restzeit stimmt)
    useEffect(() => {
        localStorage.setItem(getStorageKey('global_timer'), JSON.stringify({ ...timerState, lastTick: Date.now() }));
    }, [timerState]);

    // Läuft der Timer, wird die Restzeit aus einem festen Endzeitpunkt berechnet.
    // So bleibt sie auch korrekt, wenn der Browser den Tab im Hintergrund drosselt.
    useEffect(() => {
        if (!timerState.isRunning) return;

        const endTime = Date.now() + timerState.timeLeft * 1000;

        const tick = () => {
            const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            if (left <= 0) {
                clearInterval(interval);
                setTimerState(prev => ({ ...prev, timeLeft: 0, isRunning: false }));
                onTimeUpRef.current();
                playNotificationSound(soundRef.current);
            } else {
                setTimerState(prev => (prev.timeLeft === left ? prev : { ...prev, timeLeft: left }));
            }
        };

        const interval = setInterval(tick, 1000);
        document.addEventListener('visibilitychange', tick); // sofort nachziehen, wenn der Tab wieder sichtbar wird
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', tick);
        };
    }, [timerState.isRunning]);

    return { timerState, setTimerState };
};
