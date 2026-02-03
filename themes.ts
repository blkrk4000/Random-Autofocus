import { Theme } from './types';

export const THEMES: Record<string, Theme> = {
  default: {
    name: 'Classic',
    colors: {
      light: { '--color-app-bg': '#f3f4f6', '--color-input-bg': '#ffffff', '--color-sidebar-bg': '#ffffff', '--color-sidebar-fg': '#4b5563', '--color-sidebar-active': '#f3f4f6', '--color-paper': '#fff9c4', '--color-paper-line': '#94a3b8', '--color-paper-margin': '#ef4444', '--color-text': '#1e293b', '--color-text-dim': '#64748b', '--color-primary': '#4f46e5', '--color-primary-fg': '#ffffff', '--color-primary-dark': '#4338ca', '--color-primary-50': '#eef2ff', '--color-primary-100': '#e0e7ff' },
      dark: { '--color-app-bg': '#111827', '--color-input-bg': '#1f2937', '--color-sidebar-bg': '#0f172a', '--color-sidebar-fg': '#e2e8f0', '--color-sidebar-active': '#1e293b', '--color-paper': '#1e293b', '--color-paper-line': '#334155', '--color-paper-margin': '#ef4444', '--color-text': '#cbd5e1', '--color-text-dim': '#9ca3af', '--color-primary': '#6366f1', '--color-primary-fg': '#ffffff', '--color-primary-dark': '#6366f1', '--color-primary-50': '#1e1b4b', '--color-primary-100': '#312e81' }
    }
  },
  tomorrow: {
    name: 'Tomorrow',
    colors: {
        light: { '--color-app-bg': '#ffffff', '--color-input-bg': '#efefef', '--color-sidebar-bg': '#f6f6f6', '--color-sidebar-fg': '#4d4d4c', '--color-sidebar-active': '#e0e0e0', '--color-paper': '#ffffff', '--color-paper-line': '#d6d6d6', '--color-paper-margin': '#c82829', '--color-text': '#4d4d4c', '--color-text-dim': '#8e908c', '--color-primary': '#4271ae', '--color-primary-fg': '#ffffff', '--color-primary-dark': '#3e6a9e', '--color-primary-50': '#eaf2fa', '--color-primary-100': '#dbe8f5' },
        dark: { '--color-app-bg': '#1d1f21', '--color-input-bg': '#282a2e', '--color-sidebar-bg': '#282a2e', '--color-sidebar-fg': '#c5c8c6', '--color-sidebar-active': '#373b41', '--color-paper': '#1d1f21', '--color-paper-line': '#373b41', '--color-paper-margin': '#cc6666', '--color-text': '#c5c8c6', '--color-text-dim': '#969896', '--color-primary': '#81a2be', '--color-primary-fg': '#1d1f21', '--color-primary-dark': '#5f819d', '--color-primary-50': '#25292e', '--color-primary-100': '#2d3238' }
    }
  },
  gruvbox: {
    name: 'Gruvbox',
    colors: {
      light: { '--color-app-bg': '#ebdbb2', '--color-input-bg': '#f9f5d7', '--color-sidebar-bg': '#fbf1c7', '--color-sidebar-fg': '#3c3836', '--color-sidebar-active': '#ebdbb2', '--color-paper': '#fbf1c7', '--color-paper-line': '#d5c4a1', '--color-paper-margin': '#cc241d', '--color-text': '#3c3836', '--color-text-dim': '#7c6f64', '--color-primary': '#d65d0e', '--color-primary-fg': '#ffffff', '--color-primary-dark': '#af3a03', '--color-primary-50': '#f2e5bc', '--color-primary-100': '#ebdbb2' },
      dark: { '--color-app-bg': '#282828', '--color-input-bg': '#3c3836', '--color-sidebar-bg': '#1d2021', '--color-sidebar-fg': '#ebdbb2', '--color-sidebar-active': '#32302f', '--color-paper': '#3c3836', '--color-paper-line': '#504945', '--color-paper-margin': '#cc241d', '--color-text': '#ebdbb2', '--color-text-dim': '#a89984', '--color-primary': '#d65d0e', '--color-primary-fg': '#ffffff', '--color-primary-dark': '#fe8019', '--color-primary-50': '#32302f', '--color-primary-100': '#504945' }
    }
  },
  catppuccin: {
    name: 'Catppuccin',
    colors: {
      light: { '--color-app-bg': '#eff1f5', '--color-input-bg': '#ffffff', '--color-sidebar-bg': '#eff1f5', '--color-sidebar-fg': '#4c4f69', '--color-sidebar-active': '#e6e9ef', '--color-paper': '#e6e9ef', '--color-paper-line': '#bcc0cc', '--color-paper-margin': '#d20f39', '--color-text': '#4c4f69', '--color-text-dim': '#6c6f85', '--color-primary': '#8839ef', '--color-primary-fg': '#ffffff', '--color-primary-dark': '#7287fd', '--color-primary-50': '#f5f5f5', '--color-primary-100': '#ccd0da' },
      dark: { '--color-app-bg': '#1e1e2e', '--color-input-bg': '#181825', '--color-sidebar-bg': '#11111b', '--color-sidebar-fg': '#cdd6f4', '--color-sidebar-active': '#181825', '--color-paper': '#313244', '--color-paper-line': '#45475a', '--color-paper-margin': '#f38ba8', '--color-text': '#cdd6f4', '--color-text-dim': '#a6adc8', '--color-primary': '#cba6f7', '--color-primary-fg': '#11111b', '--color-primary-dark': '#b4befe', '--color-primary-50': '#1e1e2e', '--color-primary-100': '#313244' }
    }
  },
  terminal: {
    name: 'Terminal',
    colors: {
        light: { '--color-app-bg': '#ffffff', '--color-input-bg': '#f0f0f0', '--color-sidebar-bg': '#ffffff', '--color-sidebar-fg': '#006600', '--color-sidebar-active': '#e0ffe0', '--color-paper': '#f0f0f0', '--color-paper-line': '#000000', '--color-paper-margin': '#000000', '--color-text': '#000000', '--color-text-dim': '#444444', '--color-primary': '#008800', '--color-primary-fg': '#000000', '--color-primary-dark': '#000000', '--color-primary-50': '#eeffee', '--color-primary-100': '#ccffcc' },
        dark: { '--color-app-bg': '#000000', '--color-input-bg': '#111111', '--color-sidebar-bg': '#0c0c0c', '--color-sidebar-fg': '#00ff00', '--color-sidebar-active': '#1a1a1a', '--color-paper': '#050505', '--color-paper-line': '#1f1f1f', '--color-paper-margin': '#1f1f1f', '--color-text': '#00ff00', '--color-text-dim': '#008800', '--color-primary': '#00ff00', '--color-primary-fg': '#000000', '--color-primary-dark': '#00cc00', '--color-primary-50': '#001100', '--color-primary-100': '#002200' }
    }
  }
};