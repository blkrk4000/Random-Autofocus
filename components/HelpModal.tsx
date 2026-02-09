
import React, { useState } from 'react';
import { HelpCircle, X, Book, PlayCircle, Zap, Keyboard, FileJson, Dices, Coffee } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { SHORTCUTS } from '../shortcuts';

const HelpModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('howto'); 

    const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button 
            onClick={() => setActiveTab(id)} 
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-ink-dim hover:text-ink'}`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

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
                        
                        <div className="flex border-b border-paper-line px-2 overflow-x-auto no-scrollbar">
                            <TabButton id="howto" label="How To" icon={PlayCircle} />
                            <TabButton id="features" label="Features" icon={Zap} />
                            <TabButton id="shortcuts" label="Shortcuts" icon={Keyboard} />
                            <TabButton id="data" label="Import/Export" icon={FileJson} />
                            <TabButton id="philosophy" label="Philosophy" icon={Dices} />
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 text-sm text-ink leading-relaxed flex-1">
                            {activeTab === 'howto' && (
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="font-bold text-lg mb-3 text-primary">The Random Workflow</h4>
                                        <p className="text-ink-dim mb-4">
                                            This app combines list-keeping with random selection to defeat procrastination.
                                        </p>
                                        <ol className="space-y-4">
                                            <li className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-input-bg border border-paper-line flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                                                <div>
                                                    <strong className="block text-ink">Capture Everything</strong>
                                                    <span className="text-ink-dim">Write down everything you need to do. New tasks always go to the last page. Don't worry about order.</span>
                                                </div>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-primary text-primary-fg flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                                                <div>
                                                    <strong className="block text-primary">Trust the Dice</strong>
                                                    <span className="text-ink-dim">Click the Randomizer (Dice icon) or press <kbd>Ctrl+Shift+R</kbd>. The app will jump to a random page and highlight a task.</span>
                                                </div>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-input-bg border border-paper-line flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                                                <div>
                                                    <strong className="block text-ink">Take Action</strong>
                                                    <ul className="list-disc list-inside text-ink-dim mt-1 space-y-1">
                                                        <li><strong>Do it:</strong> Finish the task and mark it done.</li>
                                                        <li><strong>Work on it:</strong> If you start but don't finish, <strong>Re-enter</strong> it (Shift+Enter). It moves to the end of the list.</li>
                                                        <li><strong>Can't do it?</strong> If you have resistance or can't do it now, <strong>Dismiss</strong> it (highlights yellow) or <strong>Cancel</strong> it. Then roll again.</li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ol>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="font-bold text-base mb-2 flex items-center gap-2"><Dices size={16} className="text-primary"/> Randomizer Logic</h4>
                                        <p className="text-ink-dim">The dice rolls a number (1-25) and moves that many steps down the list. It circles back to the start if needed. It intelligently skips over completed tasks to find the next open one.</p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-base mb-2">🎯 Focus Mode</h4>
                                        <p className="text-ink-dim">
                                            Need to concentrate on a few specific items? Pin tasks from any page (Shortcut: <kbd>f</kbd>). 
                                            Switch to Focus Mode (Target icon) to work <strong>only</strong> on those pinned tasks. 
                                            The Randomizer will also restrict itself to your Focus list while active.
                                        </p>
                                    </section>
                                    <section>
                                        <h4 className="font-bold text-base mb-2">🏷️ Tags & Contexts</h4>
                                        <p className="text-ink-dim">Use <strong>@context</strong> (e.g., @home) or <strong>#project</strong> (e.g., #work) in your task text. Click tags to filter. Manage them in the Sidebar.</p>
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

                            {activeTab === 'data' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 border border-paper-line rounded-lg">
                                            <h5 className="font-bold flex items-center gap-2 mb-2"><FileJson size={16}/> JSON Backup</h5>
                                            <p className="text-xs text-ink-dim">
                                                Use <strong>Settings {'>'} Export JSON</strong> regularly to save a full backup of your list. You can restore this file on any device.
                                            </p>
                                        </div>
                                        <div className="p-3 border border-paper-line rounded-lg">
                                            <h5 className="font-bold flex items-center gap-2 mb-2"><Zap size={16}/> Markdown</h5>
                                            <p className="text-xs text-ink-dim">
                                                Use <strong>Copy MD</strong> to paste your tasks into Obsidian, Notion, or Roam Research.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'philosophy' && (
                                <div className="space-y-6">
                                    <div className="p-6 bg-paper border border-paper-line rounded-xl italic text-ink-dim text-center">
                                        "It takes out all the personal decisions which are hugely influenced by emotions, fear, laziness, habits and just general human fallibility..."
                                    </div>
                                    
                                    <section>
                                        <h4 className="font-bold text-lg mb-2 text-primary">Reducing Resistance by Randomness</h4>
                                        <p className="text-ink-dim leading-relaxed mb-4">
                                            The core philosophy of this app is based on Mark Forster's observations on productivity.
                                            Instead of spending time and energy deciding how urgent, important, pressing, or scary a task is, you just forget all that and <strong>accept a purely random decision</strong>.
                                        </p>
                                        <p className="text-ink-dim leading-relaxed">
                                            What we find is that stress levels fall and resistance is reduced almost to zero. We seem to have taken the <strong>“friction”</strong> out of deciding what to do next.
                                        </p>
                                    </section>
                                    
                                    <section>
                                        <h4 className="font-bold text-base mb-2">Why Re-enter tasks?</h4>
                                        <p className="text-ink-dim text-sm">
                                            If you work on a task but don't finish it, re-entering it at the end of the list allows your brain to let go of it for now. You know it's safe at the end of the queue, and the randomizer will bring it back eventually. "Little and often" is the key to completing big tasks.
                                        </p>
                                    </section>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-black/5 dark:bg-white/5 border-t border-paper-line text-center">
                            <p className="text-xs text-ink-dim flex items-center justify-center gap-1">
                                Based on Mark Forster's Random Method • Made by <strong>blkrk4000</strong> & <strong>Gemini</strong> • {APP_VERSION}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpModal;
