import React, { useState, useRef, useEffect } from 'react';

interface GoToPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGo: (pageIndex: number) => void;
    totalPages: number;
}

const GoToPageModal: React.FC<GoToPageModalProps> = ({ isOpen, onClose, onGo, totalPages }) => {
    const [page, setPage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => { 
        if (isOpen) { 
            setPage(''); 
            setTimeout(() => inputRef.current?.focus(), 50); 
        } 
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const p = parseInt(page, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            onGo(p - 1);
            onClose();
        } else if (p > totalPages) {
            onGo(totalPages - 1);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-paper rounded-xl shadow-2xl w-full max-w-sm border border-paper-line overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h3 className="text-lg font-bold text-ink mb-4">Go to Page</h3>
                    <div className="relative">
                        <input 
                            ref={inputRef} 
                            type="number" 
                            min="1" 
                            max={totalPages} 
                            placeholder={`1 - ${totalPages}`} 
                            value={page} 
                            onChange={e => setPage(e.target.value)} 
                            className="w-full px-4 py-3 bg-input-bg border border-paper-line rounded-lg text-ink focus:ring-2 focus:ring-primary outline-none text-lg font-mono" 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-dim">of {totalPages}</div>
                    </div>
                    <div className="flex justify-end mt-6 gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink-dim hover:text-ink">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-primary-fg rounded-lg text-sm font-semibold hover:brightness-110">Go</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoToPageModal;