
import { Theme } from '../types';

export const eink: Theme = {
    name: 'E-Ink',
    colors: {
      light: { 
          '--color-app-bg': '#e6e6e6', 
          '--color-input-bg': '#ffffff', 
          '--color-sidebar-bg': '#efefef', 
          '--color-sidebar-fg': '#333333', 
          '--color-sidebar-active': '#dcdcdc', 
          '--color-paper': '#f2f2f2', 
          '--color-paper-line': '#b0b0b0', 
          '--color-paper-margin': '#666666', 
          '--color-text': '#222222', 
          '--color-text-dim': '#666666', 
          '--color-primary': '#404040', 
          '--color-primary-fg': '#ffffff', 
          '--color-primary-dark': '#1a1a1a', 
          '--color-primary-50': '#d4d4d4', 
          '--color-primary-100': '#c0c0c0' 
      },
      dark: { 
          '--color-app-bg': '#222222', 
          '--color-input-bg': '#303030', 
          '--color-sidebar-bg': '#2a2a2a', 
          '--color-sidebar-fg': '#d4d4d4', 
          '--color-sidebar-active': '#3a3a3a', 
          '--color-paper': '#2a2a2a', 
          '--color-paper-line': '#4a4a4a', 
          '--color-paper-margin': '#737373', 
          '--color-text': '#dddddd', 
          '--color-text-dim': '#999999', 
          '--color-primary': '#cccccc', 
          '--color-primary-fg': '#1a1a1a', 
          '--color-primary-dark': '#ffffff', 
          '--color-primary-50': '#3a3a3a', 
          '--color-primary-100': '#4a4a4a' 
      }
    }
};
