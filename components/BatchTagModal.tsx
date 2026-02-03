import React, { useState, useRef, useEffect } from 'react';

interface BatchTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

const BatchTagModal: React.FC<BatchTagModalProps> = ({ isOpen, onClose, onAddTag, onRemoveTag }) => {
    const [tag, setTag] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { 
        if(isOpen) { 
            setTag(''); 
            setTimeout(() => inputRef.current?.focus(), 50); 
        } 
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-paper rounded-xl shadow-2xl w-full max-w-sm border border-paper-line overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-ink mb-4">Manage Tags (Selection)</h3>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        placeholder="@Context or #Project" 
                        value={tag} 
                        onChange={e => setTag(e.target.value)} 
                        className="w-full px-4 py-3 bg-input-bg border border-paper-line rounded-lg text-ink focus:ring-2 focus:ring-primary outline-none text-lg font-mono mb-6" 
                    />
                    <div className="flex flex-col gap-2">
                        <button onClick={() => { onAddTag(tag); onClose(); }} disabled={!tag.trim()} className="w-full px-4 py-2 bg-primary text-primary-fg rounded-lg font-semibold hover:brightness-110 disabled:opacity-50">Add Tag</button>
                        <button onClick={() => { onRemoveTag(tag); onClose(); }} disabled={!tag.trim()} className="w-full px-4 py-2 bg-paper-line/20 text-ink rounded-lg font-medium hover:bg-paper-line/30 disabled:opacity-50">Remove Tag</button>
                        <button onClick={onClose} className="w-full px-4 py-2 text-ink-dim hover:text-ink text-sm">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchTagModal;