import { type ThemeConfig } from '@blur-ui/tailwind-themes';

const LightColors = {
  scheme: 'light',
  colors: {
    background: { color: 'hsl(0, 0%, 95%)', generatePalette: false },
    foreground: {
      color: 'hsl(0, 0%, 0%)',
      generatePalette: false,
    },
    default: 'hsl(0, 0%, 100%)',
    divider: 'hsl(0, 0%, 85%)',
    primary: { color: 'hsl(348, 93%, 60%)', foreground: 'hsl(0, 0%, 100%)' },
    focus: 'hsl(348, 93%, 60%)',
    danger: { color: 'hsl(0, 85%, 61%)', foreground: 'hsl(0, 0%, 100%)' },
    success: { color: 'hsl(108, 69%, 46%)', foreground: 'hsl(0, 0%, 100%)' },
  },
} as const satisfies ThemeConfig['themes']['light'];

const DarkColors = {
  scheme: 'dark',
  colors: {
    background: { color: 'hsl(0, 0%, 0%)', generatePalette: false },
    foreground: { color: 'hsl(0, 0%, 100%)', generatePalette: false },
    default: 'hsl(0, 0%, 10%)',
    divider: 'hsl(0, 0%, 20%)',
    primary: { color: 'hsl(352, 100%, 56%)', foreground: 'hsl(0, 0%, 100%)' },
    focus: 'hsl(348, 71%, 58%)',
    danger: { color: 'hsl(0, 85%, 61%)', foreground: 'hsl(0, 0%, 100%)' },
    success: { color: 'hsl(130, 73%, 41%)', foreground: 'hsl(0, 0%, 100%)' },
  },
} as const satisfies ThemeConfig['themes']['dark'];

export const AppThemes = {
  default: {
    scheme: 'light',
    layout: {
      spacing: '0.25rem',
      transitionDuration: '0.2s',
    },
  },
  themes: {
    light: LightColors,
    dark: DarkColors,
  },
} as const satisfies ThemeConfig;
