
export interface Todo {
  id: string;
  text: string;
  notes: string;
  isCompleted: boolean;
  isFocused: boolean;
  isDismissed: boolean;
  isCancelled: boolean;
  pageIndex: number;
  createdAt: number;
  modifiedAt?: number;
}

export type Density = 'compact' | 'comfortable' | 'spacious';

export interface Settings {
  density: Density;
  fontFamily: 'sans' | 'serif' | 'mono';
  timerDefaultDuration: number; // in minutes
  timerBreakDuration: number; // in minutes
  timerMessage: string;
  timerShowMessage: boolean;
  timerSound: 'none' | 'sonar' | 'chime' | 'digital';
}

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  initialDuration: number;
  lastTick?: number;
}

export interface ThemeColors {
  '--color-app-bg': string;
  '--color-input-bg': string;
  '--color-sidebar-bg': string;
  '--color-sidebar-fg': string;
  '--color-sidebar-active': string;
  '--color-paper': string;
  '--color-paper-line': string;
  '--color-paper-margin': string;
  '--color-text': string;
  '--color-text-dim': string;
  '--color-primary': string;
  '--color-primary-fg': string;
  '--color-primary-dark': string;
  '--color-primary-50': string;
  '--color-primary-100': string;
}

export interface Theme {
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}
