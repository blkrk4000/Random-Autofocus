
import React, { useState } from 'react';
import { Dices, FileText, AtSign, Hash, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { APP_VERSION } from '../constants';

interface SidebarProps {
    totalPages: number;
    activePageIndex: number | string;
    onPageSelect: (pageIndex: number | string) => void;
    pageCounts: Record<number, { open: number; dismissed: number; done: number; cancelled: number }>;
    tagCounts: Record<string, number>;
    onOpenTagManager: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ totalPages, activePageIndex, onPageSelect, pageCounts, tagCounts, onOpenTagManager }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i);
    const contexts = Object.entries(tagCounts).filter(([tag]) => tag.startsWith('@')).sort() as [string, number][];
    const projects = Object.entries(tagCounts).filter(([tag]) => tag.startsWith('#')).sort() as [string, number][];
    
    // State for foldable sections
    const [sections, setSections] = useState(() => {
        return { pages: true, contexts: true, projects: true };
    });

    const toggleSection = (key: keyof typeof sections) => {
        setSections({ ...sections, [key]: !sections[key] });
    };

    const SectionHeader = ({ title, id, count, icon: Icon }: { title: string, id: keyof typeof sections, count?: number, icon?: any }) => (
        <button onClick={() => toggleSection(id)} title={sections[id] ? "Collapse Section" : "Expand Section"} className="w-full flex items-center justify-between px-6 py-2 text-xs font-semibold uppercase tracking-wider text-ink-dim hover:text-ink transition-colors group">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={14} className="opacity-70" />}
                <span>{title}</span>
                {count !== undefined && count > 0 && <span className="bg-black/5 dark:bg-white/5 px-1.5 rounded-sm text-[10px] opacity-70">{count}</span>}
            </div>
            {sections[id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
    );

    return (
        <div className="w-full bg-sidebar-bg text-sidebar-fg flex flex-col h-full border-r border-sidebar-fg/10 theme-transition">
            {/* Header cleaned up for Web/PWA use (removed top margin intended for electron drag region) */}
            <div className="h-16 flex-shrink-0 border-b border-sidebar-fg/10 flex items-center px-6 gap-3">
                 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                     <Dices size={20} strokeWidth={2.5} />
                 </div>
                 <div className="flex flex-col justify-center">
                     <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-none mb-0.5">Mark Forster's</span>
                     <h1 className="text-xl font-bold text-sidebar-fg tracking-tight leading-none font-mono">
                         Random Autofocus<span className="text-xs opacity-40 font-normal ml-2">{APP_VERSION}</span>
                     </h1>
                 </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2 space-y-2">
                <div>
                    <SectionHeader title="Pages" id="pages" />
                    {sections.pages && (
                        <ul className="animate-in fade-in slide-in-from-top-1 duration-200">
                            {pages.map((pageIndex) => { 
                                const stats = pageCounts[pageIndex] || { open: 0, dismissed: 0, done: 0, cancelled: 0 }; 
                                const hasActivity = stats.open > 0 || stats.dismissed > 0 || stats.done > 0 || stats.cancelled > 0; 
                                const isActive = activePageIndex === pageIndex; 
                                return (
                                    <li key={pageIndex}>
                                        <button onClick={() => onPageSelect(pageIndex)} title={`Go to Page ${pageIndex + 1}`} className={`w-full flex items-center justify-between px-6 py-1.5 transition-colors text-sm font-mono ${isActive ? 'bg-sidebar-active text-primary border-r-2 border-primary' : 'text-sidebar-fg hover:bg-sidebar-active/50 hover:text-primary'}`}>
                                            <div className="flex items-center gap-3"><FileText size={16} className={isActive ? 'text-primary' : 'opacity-50'} /><span>Page {pageIndex + 1}</span></div>
                                            {hasActivity && (<div className="flex items-center gap-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded border border-sidebar-fg/10 bg-sidebar-active/50">{stats.open > 0 && <span className="text-primary font-medium" title="Open Tasks">{stats.open}</span>}{stats.dismissed > 0 && <span className="text-amber-600 dark:text-amber-500 font-medium" title="Dismissed Tasks">{stats.dismissed}</span>}{stats.done > 0 && <span className="text-emerald-600 dark:text-emerald-500 font-medium" title="Completed Tasks">{stats.done}</span>}{stats.cancelled > 0 && <span className="text-gray-400 font-medium" title="Cancelled Tasks">{stats.cancelled}</span>}</div>)}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                
                {contexts.length > 0 && (
                    <div>
                        <SectionHeader title="Contexts" id="contexts" count={contexts.length} icon={AtSign} />
                        {sections.contexts && (
                            <div className="px-6 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex flex-wrap gap-2">
                                    {contexts.map(([tag, count]) => (<button key={tag} onClick={() => onPageSelect(tag)} title={`Filter by ${tag}`} className="flex items-center gap-1.5 px-2 py-1 rounded bg-sidebar-active/50 hover:bg-sidebar-active border border-sidebar-fg/10 text-xs text-sidebar-fg transition-colors group"><span className="text-primary font-medium group-hover:underline">{tag}</span>{count > 0 && <span className="opacity-50 bg-black/5 dark:bg-white/10 px-1 rounded-sm text-[10px]">{count}</span>}</button>))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {projects.length > 0 && (
                    <div>
                        <SectionHeader title="Projects" id="projects" count={projects.length} icon={Hash} />
                        {sections.projects && (
                            <div className="px-6 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex flex-wrap gap-2">
                                    {projects.map(([tag, count]) => (<button key={tag} onClick={() => onPageSelect(tag)} title={`Filter by ${tag}`} className="flex items-center gap-1.5 px-2 py-1 rounded bg-sidebar-active/50 hover:bg-sidebar-active border border-sidebar-fg/10 text-xs text-sidebar-fg transition-colors group"><span className="text-fuchsia-600 dark:text-fuchsia-400 font-medium group-hover:underline">{tag}</span>{count > 0 && <span className="opacity-50 bg-black/5 dark:bg-white/10 px-1 rounded-sm text-[10px]">{count}</span>}</button>))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {(contexts.length > 0 || projects.length > 0) && (<div className="px-6 pt-2"><button onClick={onOpenTagManager} title="Open Tag Manager" className="flex items-center gap-2 text-xs font-medium text-sidebar-fg/50 hover:text-primary transition-colors"><Settings size={12}/> Manage Tags</button></div>)}
            </div>
        </div>
    );
};

export default Sidebar;