
import React, { useState } from 'react';
import { X, Tag, Trash2, Edit3, Save, Hash, AtSign } from 'lucide-react';

interface TagManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    tagCounts: Record<string, number>;
    onRenameTag: (oldTag: string, newTag: string) => void;
    onDeleteTag: (tag: string) => void;
}

const TagManagerModal: React.FC<TagManagerModalProps> = ({ isOpen, onClose, tagCounts, onRenameTag, onDeleteTag }) => {
    const [editingTag, setEditingTag] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    if (!isOpen) return null;

    const tags = (Object.entries(tagCounts) as [string, number][]).sort((a, b) => b[1] - a[1]); // Sort by count desc
    const contexts = tags.filter(([t]) => t.startsWith('@'));
    const projects = tags.filter(([t]) => t.startsWith('#'));

    const startEdit = (tag: string) => {
        setEditingTag(tag);
        setEditValue(tag);
    };

    const handleRename = () => {
        if (editingTag && editValue.trim() && editValue !== editingTag) {
            onRenameTag(editingTag, editValue.trim());
        }
        setEditingTag(null);
    };

    const handleDelete = (tag: string) => {
        if (confirm(`Delete tag "${tag}" from all tasks?`)) {
            onDeleteTag(tag);
        }
    };

    const TagList = ({ list, icon: Icon, colorClass }: { list: [string, number][], icon: any, colorClass: string }) => (
        <div className="space-y-2">
            {list.length === 0 && <p className="text-xs text-ink-dim italic p-2">No tags found.</p>}
            {list.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between p-2 rounded-lg bg-input-bg border border-paper-line group hover:border-primary/50 transition-colors">
                    {editingTag === tag ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input 
                                type="text" 
                                value={editValue} 
                                onChange={e => setEditValue(e.target.value)}
                                className="flex-1 bg-white dark:bg-black/20 border border-primary rounded px-2 py-1 text-sm outline-none"
                                autoFocus
                                onKeyDown={e => { if(e.key === 'Enter') handleRename(); if(e.key === 'Escape') setEditingTag(null); }}
                            />
                            <button onClick={handleRename} title="Save Rename" className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Save size={14} /></button>
                            <button onClick={() => setEditingTag(null)} title="Cancel Rename" className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <Icon size={14} className={colorClass} />
                                <span className="font-mono text-sm text-ink font-medium">{tag}</span>
                                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 rounded-full text-ink-dim">{count}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(tag)} className="p-1.5 text-ink-dim hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded" title="Rename Tag"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(tag)} className="p-1.5 text-ink-dim hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete Tag"><Trash2 size={14} /></button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-paper rounded-xl shadow-2xl w-full max-w-lg border border-paper-line overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-paper-line bg-black/5 dark:bg-white/5">
                    <h3 className="font-bold text-lg text-ink flex items-center gap-2"><Tag size={18}/> Manage Tags</h3>
                    <button onClick={onClose} title="Close Manager" className="text-ink-dim hover:text-ink"><X size={20} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    <div>
                        <h4 className="text-xs font-bold text-ink-dim uppercase tracking-wider mb-3 flex items-center gap-2"><AtSign size={12}/> Contexts</h4>
                        <TagList list={contexts} icon={AtSign} colorClass="text-primary" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-ink-dim uppercase tracking-wider mb-3 flex items-center gap-2"><Hash size={12}/> Projects</h4>
                        <TagList list={projects} icon={Hash} colorClass="text-fuchsia-500" />
                    </div>
                </div>

                <div className="p-4 border-t border-paper-line bg-black/5 dark:bg-white/5 text-center">
                    <p className="text-xs text-ink-dim">Renaming or deleting a tag affects <strong>all</strong> tasks immediately.</p>
                </div>
            </div>
        </div>
    );
};

export default TagManagerModal;
