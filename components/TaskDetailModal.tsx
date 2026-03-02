
import React, { useState, useEffect, useRef } from 'react';
import { AlignLeft, X, StickyNote, Eye, Edit3, Save, Check } from 'lucide-react';
import { Todo } from '../types';
import { formatFullDate } from '../services/storageService';

const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>{part}</a>;
        }
        return part;
    });
};

interface TaskDetailModalProps {
    todo: Todo | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, text: string, notes: string) => void;
    allTags: string[];
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ todo, isOpen, onClose, onSave, allTags }) => {
    const [modalTitle, setModalTitle] = useState('');
    const [modalNotes, setModalNotes] = useState('');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [cursorPos, setCursorPos] = useState(0);
    const modalTitleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && todo) {
            setModalTitle(todo.text);
            setModalNotes(todo.notes || '');
            setIsEditingNotes(!todo.notes);
            setShowSuggestions(false);
            setTimeout(() => modalTitleRef.current?.focus(), 50);
        }
    }, [isOpen, todo]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (document.querySelector('.suggestion-box')) return; 
                e.stopPropagation();
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen || !todo) return null;

    const handleSave = () => { 
        if (modalTitle.trim()) onSave(todo.id, modalTitle, modalNotes); 
        setTimeout(() => onClose(), 0); 
    };
    
    const handleNoteCheckbox = (idx: number, isChecked: boolean) => { 
        const lines = modalNotes.split('\n'); 
        if (lines[idx]) { 
            lines[idx] = lines[idx].replace(isChecked ? '- [x]' : '- [ ]', isChecked ? '- [ ]' : '- [x]'); 
            setModalNotes(lines.join('\n')); 
        } 
    };

    const handleModalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setModalTitle(val);
        const cursor = e.target.selectionStart || 0;
        setCursorPos(cursor);
        
        const match = val.slice(0, cursor).match(/([@#][\w-]*)$/);
        if (match) {
            const fullMatch = match[1];
            const q = fullMatch.toLowerCase();
            const filtered = allTags.filter(c => c.toLowerCase().startsWith(q)).slice(0, 5);
            if (filtered.length) {
                setSuggestions(filtered);
                setShowSuggestions(true);
                setActiveSuggestionIndex(0);
            } else setShowSuggestions(false);
        } else setShowSuggestions(false);
    };

    const insertModalSuggestion = (s: string) => {
        const before = modalTitle.slice(0, cursorPos).replace(/([@#][\w-]*)$/, s + ' ');
        const full = before + modalTitle.slice(cursorPos);
        setModalTitle(full);
        setShowSuggestions(false);
        setTimeout(() => modalTitleRef.current?.focus(), 0);
    };

    const handleModalKeyDown = (e: React.KeyboardEvent) => {
        if (showSuggestions) {
            if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestionIndex(p => Math.max(0, p-1)); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestionIndex(p => Math.min(suggestions.length-1, p+1)); return; }
            if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insertModalSuggestion(suggestions[activeSuggestionIndex]); return; }
            if (e.key === 'Escape') { setShowSuggestions(false); return; }
        }
        if (e.key === 'Enter') { 
            e.preventDefault(); 
            e.stopPropagation(); 
            handleSave(); 
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-paper rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col border border-paper-line overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-paper-line bg-black/5 dark:bg-white/5"><h3 className="font-bold text-lg text-ink flex items-center gap-2"><AlignLeft size={18}/> Task Details</h3><button onClick={onClose} title="Close Details" className="text-ink-dim hover:text-ink"><X size={20} /></button></div>
                <div className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-6 pb-2 relative">
                        <label className="text-xs font-semibold text-ink-dim uppercase tracking-wider mb-2 block">Task Title</label>
                        <input ref={modalTitleRef} type="text" value={modalTitle} onChange={handleModalTitleChange} onKeyDown={handleModalKeyDown} disabled={todo.isCompleted} className="w-full p-3 text-xl font-bold bg-transparent border-b border-paper-line outline-none text-ink focus:border-primary transition-colors mb-2" />
                        {showSuggestions && (<div className="suggestion-box absolute top-full left-6 right-6 bg-paper rounded-lg shadow-xl border border-paper-line z-[110] max-h-48 overflow-y-auto"><ul>{suggestions.map((s, i) => <li key={s}><button onClick={() => insertModalSuggestion(s)} className={`w-full text-left px-4 py-2.5 text-sm text-ink ${i===activeSuggestionIndex ? 'bg-primary-50 text-primary' : ''}`}>{s}</button></li>)}</ul></div>)}
                    </div>
                    <div className="flex-1 flex flex-col px-6 pb-6 min-h-0"><div className="flex items-center justify-between mb-2"><label className="text-xs font-semibold text-ink-dim uppercase tracking-wider flex items-center gap-2"><StickyNote size={12}/> Notes & Checklists</label><button onClick={() => setIsEditingNotes(!isEditingNotes)} title={isEditingNotes ? "Switch to Preview" : "Edit Notes"} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">{isEditingNotes ? <><Eye size={12}/> Preview</> : <><Edit3 size={12}/> Edit Notes</>}</button></div>{isEditingNotes ? (<textarea value={modalNotes} onChange={e => setModalNotes(e.target.value)} placeholder="Add details, links, or checklists ( - [ ] )" className="flex-1 w-full p-4 text-sm bg-input-bg border border-paper-line rounded-lg outline-none text-ink font-mono resize-none focus:ring-2 focus:ring-primary/20" autoFocus />) : (<div className="flex-1 w-full p-4 text-sm bg-paper/50 border border-paper-line/30 rounded-lg overflow-y-auto text-ink prose prose-sm dark:prose-invert" onClick={() => !modalNotes && setIsEditingNotes(true)}>
                        {modalNotes ? modalNotes.split('\n').map((line, i) => { 
                            const trimmed = line.trim();
                            
                            // Headings
                            if (trimmed.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-primary mt-4 mb-2 first:mt-0">{trimmed.replace(/^#\s+/, '')}</h1>;
                            if (trimmed.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-primary opacity-90 mt-3 mb-1">{trimmed.replace(/^##\s+/, '')}</h2>;
                            if (trimmed.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-ink-dim mt-2 mb-1 uppercase tracking-wide">{trimmed.replace(/^###\s+/, '')}</h3>;

                            // Checkboxes
                            const isChecked = trimmed.startsWith('- [x]'); 
                            const isUnchecked = trimmed.startsWith('- [ ]'); 
                            if (isChecked || isUnchecked) { 
                                const content = line.replace(/- \[[ x]\]/, '').trim(); 
                                return (<div key={i} className="flex items-start gap-3 py-1 group cursor-pointer" onClick={() => handleNoteCheckbox(i, isChecked)}><div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${isChecked ? 'bg-primary border-primary text-primary-fg' : 'border-ink-dim text-transparent group-hover:border-primary'}`}><Check size={10} strokeWidth={4} /></div><span className={`flex-1 ${isChecked ? 'line-through text-ink-dim' : 'text-ink'}`}>{renderTextWithLinks(content)}</span></div>); 
                            } 
                            
                            // Plain text
                            return <div key={i} className="min-h-[1.5em] py-0.5 whitespace-pre-wrap">{renderTextWithLinks(line)}</div>; 
                        }) : <div className="text-ink-dim italic">No notes. Click to add details...</div>}
                    </div>)}</div>
                </div>
                <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-paper-line flex justify-between items-center"><div className="text-xs text-ink-dim font-mono flex flex-col gap-1"><div>Created: {formatFullDate(todo.createdAt)}</div>{todo.modifiedAt && <div>Modified: {formatFullDate(todo.modifiedAt)}</div>}</div><div className="flex gap-3"><button onClick={onClose} className="px-4 py-2 text-sm font-medium text-ink-dim hover:text-ink">Cancel</button><button onClick={handleSave} title="Save Changes" className="px-4 py-2 text-sm font-semibold text-primary-fg bg-primary rounded-lg flex items-center gap-2 shadow-sm hover:brightness-110"><Save size={16} /> Save Changes</button></div></div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
