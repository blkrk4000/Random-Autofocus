
import React from 'react';
import { Bell, Coffee } from 'lucide-react';

interface TimeUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    onStartBreak?: () => void;
    breakDuration?: number;
}

const TimeUpModal: React.FC<TimeUpModalProps> = ({ isOpen, onClose, message, onStartBreak, breakDuration }) => {
    if (!isOpen) return null;
    return (
        <div 
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={onClose}
        >
             <div 
                className="bg-paper rounded-2xl shadow-2xl w-full max-w-sm border border-paper-line overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Bell size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-ink mb-2">Time's Up!</h2>
                <p className="text-ink-dim mb-8">{message || "Great work! Take a break or pick a new task."}</p>
                <div className="space-y-3">
                    {onStartBreak && (
                        <button 
                            onClick={onStartBreak} 
                            className="w-full py-3 bg-primary text-primary-fg rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Coffee size={20} /> Start Break ({breakDuration}m)
                        </button>
                    )}
                    <button 
                        onClick={onClose} 
                        className="w-full py-3 bg-paper-line/20 text-ink rounded-xl font-bold text-lg hover:bg-paper-line/30 transition-all"
                    >
                        OK, got it!
                    </button>
                </div>
             </div>
        </div>
    );
};

export default TimeUpModal;
