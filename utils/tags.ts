// Tags: @Kontext und #Projekt. Unicode-fähig (Umlaute) und mit Bindestrich.
export const extractTags = (text: string): string[] =>
    text.match(/[@#][\p{L}\p{N}_-]+/gu) ?? [];
