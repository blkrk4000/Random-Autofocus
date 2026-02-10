
import React from 'react';
import { Settings, X, Type, CheckCircle2, Database, Download, Upload, Archive, AlertTriangle, Sparkles, Layers, Grid } from 'lucide-react';
import { Settings as SettingsType, Density } from '../types';
import { DENSITY_CONFIG } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: SettingsType;
    onUpdateSettings: (s: SettingsType) => void;
    onExport: () => void;
    onExportMD: () => void;
    onImport: () => void;
    onArchive: () => void;
    onArchiveMD: () => void;
    onResetAll: () => void;
    onLoadDemoData: () => void;
    onCompactPages: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, onExport, onExportMD, onImport, onArchive, onArchiveMD, onResetAll, onLoadDemoData, onCompactPages }) => {
    if (!isOpen) return null;
    
    const fontFamilies: { id: SettingsType['fontFamily']; name: string; class: string }[] = [
        { id: 'sans', name: 'Modern (Sans)', class: 'font-sans' },
        { id: 'serif', name: 'Book (Serif)', class: 'font-serif' },
        { id: 'mono', name: 'Code (Mono)', class: 'font-mono' },
    ];

    const densities: { id: Density; name: string; description: string }[] = [
        { id: 'compact', name: 'Compact', description: `${DENSITY_CONFIG.compact.itemsPerPage} items/page` },
        { id: 'comfortable', name: 'Comfortable', description: `${DENSITY_CONFIG.comfortable.itemsPerPage} items/page` },
        { id: 'spacious', name: 'Spacious', description: `${DENSITY_CONFIG.spacious.itemsPerPage} items/page` },
    ];
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-paper rounded-xl shadow-2xl w-full max-w-md border border-paper-line overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-paper-line bg-black/5 dark:bg-white/5">
                    <h3 className="font-bold text-lg text-ink flex items-center gap-2"><Settings size={18}/> Settings</h3>
                    <button onClick={onClose} title="Close Settings" className="text-ink-dim hover:text-ink"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
                     {/* Appearance */}
                     <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-ink-dim uppercase tracking-wider mb-3"><Type size={16}/> Typography & Layout</label>
                        <div className="grid grid-cols-1 gap-2 mb-4">
                            {fontFamilies.map(font => (
                                <button key={font.id} onClick={() => onUpdateSettings({ ...settings, fontFamily: font.id })} title={`Select ${font.name} Font`} className={`flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all ${settings.fontFamily === font.id ? 'bg-primary-50 border-primary text-primary ring-1 ring-primary' : 'bg-input-bg border-paper-line text-ink hover:border-primary/50'}`}>
                                    <span className={`${font.class} text-lg`}>{font.name}</span>
                                    {settings.fontFamily === font.id && <CheckCircle2 size={18} />}
                                </button>
                            ))}
                        </div>
                        
                        <label className="flex items-center gap-2 text-xs font-semibold text-ink-dim uppercase tracking-wider mb-2"><Grid size={14}/> Density</label>
                        <div className="flex gap-2 bg-input-bg p-1 rounded-lg border border-paper-line">
                            {densities.map(d => (
                                <button key={d.id} onClick={() => onUpdateSettings({ ...settings, density: d.id })} className={`flex-1 py-2 rounded-md transition-all flex flex-col items-center justify-center gap-1 ${settings.density === d.id ? 'bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-black/5' : 'text-ink-dim hover:text-ink hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                    <span className="font-bold text-sm">{d.name}</span>
                                    <span className="text-[9px] opacity-70">{d.description}</span>
                                </button>
                            ))}
                        </div>
                     </div>
                     
                     <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-ink-dim uppercase tracking-wider mb-3"><Database size={16}/> Data Management</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={onExport} title="Download backup as JSON" className="flex items-center justify-center gap-2 bg-input-bg border border-paper-line hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5 py-2.5 rounded-lg text-ink transition-all font-medium text-xs sm:text-sm"><Download size={14}/> JSON</button>
                            <button onClick={onExportMD} title="Download backup as Markdown" className="flex items-center justify-center gap-2 bg-input-bg border border-paper-line hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5 py-2.5 rounded-lg text-ink transition-all font-medium text-xs sm:text-sm"><Download size={14}/> Markdown</button>
                            <button onClick={onImport} title="Restore from backup" className="col-span-2 flex items-center justify-center gap-2 bg-input-bg border border-paper-line hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5 py-2.5 rounded-lg text-ink transition-all font-medium text-xs sm:text-sm"><Upload size={14}/> Import JSON/MD/TXT</button>
                        </div>
                        <div className="mt-2">
                            <button onClick={onLoadDemoData} className="w-full flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 py-2.5 rounded-lg transition-all font-medium text-xs sm:text-sm"><Sparkles size={14}/> Load Demo Data</button>
                        </div>
                     </div>

                     <div className="pt-2 border-t border-paper-line/50">
                        <label className="flex items-center gap-2 text-sm font-semibold text-red-500 uppercase tracking-wider mb-3"><Archive size={16}/> Maintenance</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button onClick={onArchive} title="Archive completed tasks (JSON)" className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 py-3 rounded-lg text-red-600 dark:text-red-400 transition-all font-medium text-sm">
                                Archive JSON
                            </button>
                            <button onClick={onArchiveMD} title="Archive completed tasks (MD)" className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 py-3 rounded-lg text-red-600 dark:text-red-400 transition-all font-medium text-sm">
                                Archive MD
                            </button>
                            <button onClick={onCompactPages} title="Re-arrange tasks to fill empty slots on pages" className="col-span-2 flex items-center justify-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 py-3 rounded-lg text-orange-600 dark:text-orange-400 transition-all font-medium text-sm">
                                <Layers size={14} /> Re-Calculate Pages
                            </button>
                        </div>
                        
                         <button onClick={onResetAll} title="Delete EVERYTHING" className="w-full flex items-center justify-center gap-2 bg-red-600 text-white border border-red-700 hover:bg-red-700 py-3 rounded-lg transition-all font-bold text-sm shadow-md">
                             <AlertTriangle size={16} /> RESET APP (DELETE ALL)
                         </button>
                        <p className="text-xs text-ink-dim mt-2 text-center">Caution: "Reset App" deletes <strong>everything</strong> permanently.</p>
                     </div>
                </div>
                <div className="p-4 border-t border-paper-line bg-black/5 dark:bg-white/5 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-fg rounded-lg font-semibold hover:brightness-110">Done</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
