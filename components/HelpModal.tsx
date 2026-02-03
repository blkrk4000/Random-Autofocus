
import React, { useState } from 'react';
import { HelpCircle, X, Book, CheckSquare, Laptop, Smartphone, Wifi, Coffee } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { SHORTCUTS } from '../shortcuts';

const HelpModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('guide'); 

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="p-2 text-ink-dim hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors" title="Documentation & Help"><HelpCircle size={20} /></button>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="bg-paper rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-paper-line max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-line bg-black/5 dark:bg-white/5">
                            <h3 className="font-bold text-lg text-ink flex items-center gap-2"><Book size={18} className="text-primary"/> Documentation</h3>
                            <button onClick={() => setIsOpen(false)} title="Close Help" className="text-ink-dim hover:text-ink"><X size={20} /></button>
                        </div>
                        
                        <div className="flex border-b border-paper-line px-2 overflow-x-auto">
                            <button onClick={() => setActiveTab('guide')} className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'guide' ? 'border-primary text-primary' : 'border-transparent text-ink-dim hover:text-ink'}`}>Start Guide</button>
                            <button onClick={() => setActiveTab('features')} className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'features' ? 'border-primary text-primary' : 'border-transparent text-ink-dim hover:text-ink'}`}>Features</button>
                            <button onClick={() => setActiveTab('shortcuts')} className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'shortcuts' ? 'border-primary text-primary' : 'border-transparent text-ink-dim hover:text-ink'}`}>Shortcuts</button>
                            <button onClick={() => setActiveTab('install')} className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'install' ? 'border-primary text-primary' : 'border-transparent text-ink-dim hover:text-ink'}`}>Install/Offline</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 text-sm text-ink leading-relaxed flex-1">
                            {activeTab === 'guide' && (
                                <div className="space-y-4">
                                    <section>
                                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckSquare size={18} className="text-primary"/> The Autofocus Philosophy</h4>
                                        <p className="text-ink-dim">
                                            This app implements Mark Forster's <strong>Autofocus v1</strong> system. It treats your tasks like a college block.
                                        </p>
                                        <ul className="list-disc list-inside mt-2 space-y-1 text-ink-dim ml-2">
                                            <li>New tasks always go to the <strong>last page</strong>.</li>
                                            <li>You work through pages one by one.</li>
                                            <li>If you finish a task, check it off.</li>
                                            <li>If you work on it but don't finish, <strong>re-enter it</strong> (Shift+Enter). It moves to the end of the list.</li>
                                            <li>If you skip a task on an active page, <strong>highlight (dismiss) it</strong>.</li>
                                            <li>If you abandon a task completely, <strong>cancel it</strong>.</li>
                                        </ul>
                                    </section>
                                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-900/50">
                                        <h5 className="font-semibold text-primary mb-1">Status Colors</h5>
                                        <ul className="space-y-2 text-ink-dim">
                                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span><strong>Open:</strong> Ready to work on.</span></li>
                                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span><strong>Done:</strong> Finished completely.</span></li>
                                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span><strong>Dismissed:</strong> Skipped for now.</span></li>
                                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400"></span><span><strong>Cancelled:</strong> Won't do.</span></li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="font-bold text-base mb-2">📌 Focus Mode</h4>
                                        <p className="text-ink-dim">Pin tasks from any page to a temporary "Focus Sheet" (Shortcut: <kbd>f</kbd>). Useful for planning your day across multiple pages.</p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-base mb-2">🎲 Randomizer</h4>
                                        <p className="text-ink-dim">Stuck? Click the Dice icon (<kbd>Ctrl+Shift+R</kbd>) to let the app pick a task for you.</p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-base mb-2">🏷️ Tags & Contexts</h4>
                                        <p className="text-ink-dim">Use <strong>@context</strong> (e.g., @home) or <strong>#project</strong> (e.g., #work) in your task text. Click tags to filter. Manage them in the Sidebar.</p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-base mb-2">⏱️ Global Timer</h4>
                                        <p className="text-ink-dim">A simple Pomodoro-style timer in the header. Click the time to edit duration.</p>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'shortcuts' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {SHORTCUTS.map(s => (
                                        <div key={s.key} className="flex justify-between items-center p-2 bg-input-bg rounded border border-paper-line/50">
                                            <span className="text-ink-dim font-medium">{s.description}</span>
                                            <kbd className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-ink">{s.key}</kbd>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'install' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/50 flex gap-3">
                                        <Wifi size={24} className="text-emerald-600 flex-shrink-0"/>
                                        <div>
                                            <h5 className="font-bold text-emerald-700 dark:text-emerald-400">Offline Capable</h5>
                                            <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 mt-1">
                                                This app only needs internet <strong>once</strong> to load. It then saves itself to your browser. Your data lives 100% on your device (Local Storage).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 border border-paper-line rounded-lg">
                                            <h5 className="font-bold flex items-center gap-2 mb-2"><Laptop size={16}/> Desktop</h5>
                                            <p className="text-xs text-ink-dim">Simply save this <code>index.html</code> file anywhere. Double click to run. No server needed.</p>
                                        </div>
                                        <div className="p-3 border border-paper-line rounded-lg">
                                            <h5 className="font-bold flex items-center gap-2 mb-2"><Smartphone size={16}/> iOS / Android</h5>
                                            <p className="text-xs text-ink-dim">
                                                1. Open in Safari (iOS) or Chrome (Android).<br/>
                                                2. Tap "Share" or Menu.<br/>
                                                3. Select <strong>"Add to Home Screen"</strong>.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 text-xs text-ink-dim text-center italic">
                                        ⚠️ Caution: If you clear your browser's "Site Data", your tasks will be deleted. Use the "Export JSON" feature in Settings regularly for backups!
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-black/5 dark:bg-white/5 border-t border-paper-line text-center">
                            <p className="text-xs text-ink-dim flex items-center justify-center gap-1">
                                Made with <Coffee size={10}/> by <strong>blkrk4000</strong> & <strong>Gemini</strong> • {APP_VERSION}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpModal;
