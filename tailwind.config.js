/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.ts',
    './utils/**/*.ts',
    './services/**/*.ts',
    './themes/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        paper: 'var(--color-paper)',
        'paper-line': 'var(--color-paper-line)',
        'paper-margin': 'var(--color-paper-margin)',
        'app-bg': 'var(--color-app-bg)',
        'input-bg': 'var(--color-input-bg)',
        'sidebar-bg': 'var(--color-sidebar-bg)',
        'sidebar-fg': 'var(--color-sidebar-fg)',
        'sidebar-active': 'var(--color-sidebar-active)',
        ink: 'var(--color-text)',
        'ink-dim': 'var(--color-text-dim)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          fg: 'var(--color-primary-fg)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          600: 'var(--color-primary)',
          700: 'var(--color-primary-dark)',
        },
      },
    },
  },
  plugins: [],
};
