
import packageJson from './package.json';

export const APP_VERSION = `v${packageJson.version}`;

export const DENSITY_CONFIG = {
    compact: {
        itemsPerPage: 75,
        lineHeight: 22, // Slightly tighter for 75 items
        fontSizeClass: 'text-sm'
    },
    comfortable: {
        itemsPerPage: 50,
        lineHeight: 28, // Standard notebook line height
        fontSizeClass: 'text-base'
    },
    spacious: {
        itemsPerPage: 25,
        lineHeight: 36, // Relaxed
        fontSizeClass: 'text-lg'
    }
};

// Fallback constant
export const DEFAULT_ITEMS_PER_PAGE = 50;