
import React, { useState, useRef, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { TimerState } from '../types';
import { formatTime } from '../services/storageService';
import { primeAudio } from '../services/soundService';

interface GlobalTimerProps {
    timerState: TimerState;
    setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
    defaultDuration: number;
    onOpenSettings: () => void;
}

const GlobalTimer: React.FC<GlobalTimerProps> = ({ timerState, setTimerState, defaultDuration, onOpenSettings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { 
        if(isEditing && inputRef.current) { 
            inputRef.current.focus(); 
            inputRef.current.select(); 
        } 
    }, [isEditing]);
    
    const handleStartEdit = () => {
        if(!timerState.isRunning) {
             setEditValue(Math.floor(timerState.timeLeft/60).toString());
             setIsEditing(true);
        }
    };
    
    const handleSaveEdit = () => {
        const m = parseInt(editValue, 10);
        if(!isNaN(m) && m > 0) {
            setTimerState({timeLeft: m * 60, initialDuration: m * 60, isRunning: false});
        }
        setIsEditing(false);
    };

    // Use the setting default duration if resetting
    const handleReset = () => {
        const duration = defaultDuration * 60;
        setTimerState(p => ({...p, timeLeft: duration, initialDuration: duration, isRunning: false}));
    };

    return (
        <div className={`flex items-center gap-1.5 bg-input-bg px-2 pl-2 py-1.5 rounded-full border shadow-sm transition-all ${isEditing ? 'ring-2 ring-primary border-transparent' : 'border-paper-line/50'} ${timerState.isRunning ? 'border-primary/50' : ''}`}>
            <button 
                onClick={onOpenSettings} 
                className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${timerState.isRunning ? 'text-primary animate-pulse' : 'text-ink-dim'}`}
                title="Timer Settings"
            >
                <Timer size={14} />
            </button>
            
            {isEditing ? (
                <div className="flex items-center">
                    <input ref={inputRef} type="number" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleSaveEdit} onKeyDown={e=>{if(e.key==='Enter') handleSaveEdit()}} className="w-8 text-center font-mono text-sm bg-transparent outline-none text-primary border-b border-primary" />
                    <span className="text-xs text-ink-dim ml-0.5">m</span>
                </div>
            ) : (
                <span onClick={handleStartEdit} title="Click to edit duration" className={`font-mono font-medium w-11 text-center text-sm ${!timerState.isRunning ? 'cursor-pointer hover:text-primary' : ''} ${timerState.timeLeft === 0 ? 'text-red-500' : 'text-ink'}`}>
                    {formatTime(timerState.timeLeft)}
                </span>
            )}
            <div className="h-3 w-px bg-paper-line mx-0.5"></div>
            <button onClick={() => { primeAudio(); setTimerState(p => ({...p, isRunning: !p.isRunning})); }} title={timerState.isRunning ? "Pause Timer" : "Start Timer"} className="p-0.5 text-primary hover:scale-110 transition-transform">{timerState.isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
            <button onClick={handleReset} title="Reset Timer" className="p-0.5 text-ink-dim hover:text-ink hover:rotate-180 transition-transform"><RotateCcw size={14} /></button>
        </div>
    );
};

export default GlobalTimer;
