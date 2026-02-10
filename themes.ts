
import { Theme } from './types';
import { legalpad } from './themes/legalpad';
import { dracula } from './themes/dracula';
import { solarized } from './themes/solarized';
import { eink } from './themes/eink';
import { tomorrow } from './themes/tomorrow';
import { gruvbox } from './themes/gruvbox';
import { catppuccin } from './themes/catppuccin';
import { terminal } from './themes/terminal';

export const THEMES: Record<string, Theme> = {
  default: legalpad,
  dracula,
  solarized,
  eink,
  tomorrow,
  gruvbox,
  catppuccin,
  terminal
};
