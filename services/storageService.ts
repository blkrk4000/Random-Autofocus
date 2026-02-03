// --- [STORAGE MANAGER] ---
export const getStorageKey = (keySuffix: string) => {
    try {
        const path = window.location.pathname;
        const filename = decodeURIComponent(path.substring(path.lastIndexOf('/') + 1)) || 'index.html';
        return `autofocus_${filename}_${keySuffix}`;
    } catch (e) {
        return `autofocus_fallback_${keySuffix}`;
    }
};

export const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2, '0')}`;

export const formatFullDate = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};