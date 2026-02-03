
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface InputAreaProps {
    onAddTodo: (text: string) => void;
    nextPageIndex: number;
    isExpanded: boolean;
    setIsExpanded: (v: boolean) => void;
    onPaste?: (e: React.ClipboardEvent) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onAddTodo, nextPageIndex, isExpanded, setIsExpanded, onPaste }) => {
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAddTodo(text);
            setText('');
            // Keep focus for rapid entry
            inputRef.current?.focus();
        }
    };

    // Auto-focus when expanded
    useEffect(() => {
        if (isExpanded) {
            // Small delay to ensure render
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isExpanded]);

    // Note: We use style injection for the bottom position to support env(safe-area-inset-bottom)
    // which Tailwind doesn't support by default without a plugin.
    return (
        <div 
            className="absolute left-0 right-0 flex justify-center z-50 pointer-events-none" 
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
            <div className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] overflow-visible ${isExpanded ? 'bg-sidebar-bg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl w-[90%] max-w-2xl translate-y-0 opacity-100' : 'bg-transparent border-none shadow-none w-auto translate-y-0 opacity-100'}`}>
                {isExpanded ? (
                    <div className="relative w-full">
                        <form onSubmit={handleSubmit} className="flex gap-2 p-2 w-full items-center">
                            <div className="relative flex-1">
                                <input 
                                    ref={inputRef} 
                                    type="text" 
                                    value={text} 
                                    onChange={e => setText(e.target.value)} 
                                    onPaste={onPaste}
                                    placeholder="New Task..." 
                                    className="w-full pl-4 pr-32 py-2.5 leading-normal bg-input-bg border-none rounded-xl text-ink focus:ring-0 outline-none text-lg placeholder:text-ink-dim/50" 
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-60">
                                    <span className="text-xs font-semibold text-ink-dim">Page {nextPageIndex + 1}</span>
                                </div>
                            </div>
                            <button type="submit" title="Add Task (Enter)" disabled={!text.trim()} className="bg-primary text-primary-fg px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 flex items-center gap-2 shadow-sm text-sm whitespace-nowrap">
                                <Plus size={18} /> Add
                            </button>
                            <button type="button" title="Cancel" onClick={() => { setIsExpanded(false); setText(''); }} className="p-2.5 text-ink-dim hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 rounded-xl">
                                <X size={20}/>
                            </button>
                        </form>
                    </div>
                ) : (
                    <button onClick={() => setIsExpanded(true)} title="Create New Task (Ctrl+N)" className="flex items-center gap-2 px-6 py-3 bg-primary hover:brightness-110 text-primary-fg font-semibold rounded-full shadow-lg transition-transform active:scale-95 group">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> <span>New Task</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputArea;
