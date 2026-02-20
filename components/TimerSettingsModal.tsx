
import React from 'react';
import { X, MoveVertical, MessageSquare, Volume2, Bell, Timer, Coffee } from 'lucide-react';
import { Settings } from '../types';
import { playNotificationSound } from '../services/soundService';

interface TimerSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onUpdateSettings: (s: Settings) => void;
}

const TimerSettingsModal: React.FC<TimerSettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
    if (!isOpen) return null;

    const sounds: { id: Settings['timerSound']; name: string }[] = [
        { id: 'none', name: 'Silent' },
        { id: 'sonar', name: 'Sonar' },
        { id: 'chime', name: 'Soft Chime' },
        { id: 'digital', name: 'Digital Beep' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-paper rounded-xl shadow-2xl w-full max-w-sm border border-paper-line overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-paper-line bg-black/5 dark:bg-white/5">
                    <h3 className="font-bold text-lg text-ink flex items-center gap-2"><Timer size={18} className="text-primary"/> Timer Settings</h3>
                    <button onClick={onClose} title="Close Settings" className="text-ink-dim hover:text-ink"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-ink-dim flex items-center gap-2"><MoveVertical size={12}/> Focus (min)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="180"
                                value={settings.timerDefaultDuration} 
                                onChange={e => onUpdateSettings({ ...settings, timerDefaultDuration: Math.max(1, parseInt(e.target.value) || 25) })}
                                className="w-full px-4 py-2.5 bg-input-bg border border-paper-line rounded-lg text-ink focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-ink-dim flex items-center gap-2"><Coffee size={12}/> Break (min)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="60"
                                value={settings.timerBreakDuration ?? 5} 
                                onChange={e => onUpdateSettings({ ...settings, timerBreakDuration: Math.max(1, parseInt(e.target.value) || 5) })}
                                className="w-full px-4 py-2.5 bg-input-bg border border-paper-line rounded-lg text-ink focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-ink-dim flex items-center gap-2"><MessageSquare size={12}/> Time's Up Message</label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-ink font-medium">
                                <input 
                                    type="checkbox" 
                                    checked={settings.timerShowMessage ?? true}
                                    onChange={e => onUpdateSettings({ ...settings, timerShowMessage: e.target.checked })}
                                    className="accent-primary w-4 h-4 rounded"
                                />
                                Show Popup
                            </label>
                        </div>
                        <input 
                            type="text" 
                            disabled={settings.timerShowMessage === false}
                            value={settings.timerMessage} 
                            onChange={e => onUpdateSettings({ ...settings, timerMessage: e.target.value })}
                            placeholder="e.g. Time to break!"
                            className={`w-full px-4 py-2.5 bg-input-bg border border-paper-line rounded-lg text-ink focus:ring-2 focus:ring-primary outline-none transition-opacity ${settings.timerShowMessage === false ? 'opacity-50' : ''}`}
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink-dim flex items-center gap-2"><Volume2 size={12}/> Notification Sound</label>
                        <div className="grid grid-cols-2 gap-2">
                            {sounds.map(sound => (
                                <button 
                                    key={sound.id} 
                                    title={`Select ${sound.name}`}
                                    onClick={() => { onUpdateSettings({ ...settings, timerSound: sound.id }); playNotificationSound(sound.id); }}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${settings.timerSound === sound.id ? 'bg-primary-50 border-primary text-primary' : 'bg-input-bg border-paper-line text-ink hover:border-primary/50'}`}
                                >
                                    {sound.name}
                                    {settings.timerSound === sound.id && <Bell size={12} fill="currentColor"/>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-paper-line bg-black/5 dark:bg-white/5 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-primary text-primary-fg rounded-lg font-semibold hover:brightness-110">Done</button>
                </div>
            </div>
        </div>
    );
};

export default TimerSettingsModal;