
import { Theme } from '../types';

export const legalpad: Theme = {
    name: 'Legal Pad',
    colors: {
      light: { 
          '--color-app-bg': '#f3f4f6', 
          '--color-input-bg': '#ffffff', 
          '--color-sidebar-bg': '#ffffff', 
          '--color-sidebar-fg': '#4b5563', 
          '--color-sidebar-active': '#f3f4f6', 
          '--color-paper': '#fff9c4', 
          '--color-paper-line': '#94a3b8', 
          '--color-paper-margin': '#ef4444', 
          '--color-text': '#1e293b', 
          '--color-text-dim': '#64748b', 
          '--color-primary': '#4f46e5', 
          '--color-primary-fg': '#ffffff', 
          '--color-primary-dark': '#4338ca', 
          '--color-primary-50': '#eef2ff', 
          '--color-primary-100': '#e0e7ff' 
      },
      dark: { 
          '--color-app-bg': '#12110c', // Very dark brown/black background
          '--color-input-bg': '#262315', 
          '--color-sidebar-bg': '#1c1912', 
          '--color-sidebar-fg': '#d4cfb8', 
          '--color-sidebar-active': '#2b271c', 
          '--color-paper': '#262315', // Dark Ochre/Mustard Paper
          '--color-paper-line': '#3d3826', // Subtle lighter lines
          '--color-paper-margin': '#7f1d1d', // Dark red margin
          '--color-text': '#ece7c5', // Parchment/Cream text
          '--color-text-dim': '#8c866d', 
          '--color-primary': '#60a5fa', // Light blue ink (Contrast against yellow/brown)
          '--color-primary-fg': '#1e1b4b', 
          '--color-primary-dark': '#3b82f6', 
          '--color-primary-50': '#332f18', 
          '--color-primary-100': '#3d3822' 
      }
    }
};
