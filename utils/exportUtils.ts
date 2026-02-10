
import { Todo } from '../types';

export const generateMarkdown = (list: Todo[], title?: string) => {
    let md = title ? `# ${title}\n\n` : '';
    md += list.map(t => {
        const status = t.isCompleted ? 'x' : t.isCancelled ? '-' : ' ';
        let line = `- [${status}] ${t.text}`;
        if (t.notes) line += '\n' + t.notes.split('\n').map(n => `    ${n}`).join('\n');
        return line;
    }).join('\n');
    return md;
};

export const downloadJSON = (data: any, filename: string) => {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

export const downloadText = (content: string, filename: string) => {
    const a = document.createElement('a');
    a.href = "data:text/markdown;charset=utf-8," + encodeURIComponent(content);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

export const parseImportFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const content = ev.target?.result as string;
                if (file.name.endsWith('.json')) {
                    const result = JSON.parse(content);
                    resolve(result);
                } else {
                    reject('Unsupported file type');
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};
