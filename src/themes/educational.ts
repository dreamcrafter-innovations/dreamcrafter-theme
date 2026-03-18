// ============================================================
// DREAMCRAFTER — Educational Genre Theme
// Apps: Math apps, science videos, coding tutorials, Ivy League Prep, Debate App
// Colors: Deep Blue #1B3A6B + Gold #F0A500 + Teal #4ECDC4
// Fonts: Nunito (headings) + Merriweather (body)
// Feel: Trustworthy, academic, encouraging, clear
// ============================================================

import type { DreamcrafterTheme, Shadows, BorderRadius, ComponentTokens } from '../types';
import {
  spacing, fontSize, fontWeight, lineHeight, letterSpacing,
  animationDuration, animationEasing, zIndex, breakpoints,
  stateColors, sharedComponentTokens,
} from '../tokens';

// ── Raw palette ──────────────────────────────────────────────
const palette = {
  blue50:   '#EEF2FF',
  blue100:  '#C7D4EE',
  blue200:  '#9FB5DC',
  blue300:  '#6E90C4',
  blue400:  '#4570AC',
  blue500:  '#1B3A6B',  // PRIMARY
  blue600:  '#162F56',
  blue700:  '#112342',
  blue800:  '#0B172D',
  blue900:  '#060C17',
  gold50:   '#FFFBEB',
  gold100:  '#FEF3C7',
  gold200:  '#FDE68A',
  gold300:  '#F6C84A',
  gold400:  '#F0A500',  // SECONDARY
  gold500:  '#D48F00',
  gold600:  '#B87A00',
  teal400:  '#4ECDC4',  // ACCENT
  teal500:  '#38B2A8',
  white:    '#FFFFFF',
  slate50:  '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
};

// ── Border Radius ────────────────────────────────────────────
// Educational: moderate radius — professional but approachable
const borderRadius: BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

// ── Shadows (light mode) ─────────────────────────────────────
const shadowsLight: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: palette.blue500, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },
  sm:   { shadowColor: palette.blue500, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  md:   { shadowColor: palette.blue500, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 4 },
  lg:   { shadowColor: palette.blue500, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  xl:   { shadowColor: palette.blue500, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 16 },
};

// ── Shadows (dark mode) ──────────────────────────────────────
const shadowsDark: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 2, elevation: 1 },
  sm:   { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 2 },
  md:   { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 8, elevation: 4 },
  lg:   { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  xl:   { shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.40, shadowRadius: 24, elevation: 16 },
};

// ── Component Tokens ─────────────────────────────────────────
const components: ComponentTokens = {
  ...sharedComponentTokens,
  button: { ...sharedComponentTokens.button, borderRadius: borderRadius.md },
  input:  { ...sharedComponentTokens.input,  borderRadius: borderRadius.sm },
  card:   { padding: spacing[4], borderRadius: borderRadius.lg, borderWidth: 1 },
  badge:  { ...sharedComponentTokens.badge,  borderRadius: borderRadius.full },
  bottomSheet: { ...sharedComponentTokens.bottomSheet, borderRadius: borderRadius.xl },
  tabBar: sharedComponentTokens.tabBar,
  header: sharedComponentTokens.header,
  avatar: sharedComponentTokens.avatar,
  icon:   sharedComponentTokens.icon,
};

// ── Light Theme ───────────────────────────────────────────────
export const educationalLight: DreamcrafterTheme = {
  genre: 'educational',
  mode: 'light',
  colors: {
    primary:          palette.blue500,
    primaryLight:     palette.blue100,
    primaryDark:      palette.blue700,
    secondary:        palette.gold400,
    secondaryLight:   palette.gold100,
    secondaryDark:    palette.gold500,
    accent:           palette.teal400,

    background:       palette.slate50,
    surface:          palette.white,
    surfaceRaised:    palette.white,
    surfaceSunken:    palette.slate100,

    textPrimary:      palette.slate800,
    textSecondary:    palette.slate500,
    textDisabled:     palette.slate300,
    textInverse:      palette.white,
    textLink:         palette.blue500,

    border:           palette.slate200,
    borderStrong:     palette.slate300,
    borderFocus:      palette.gold400,

    ripple:           'rgba(27, 58, 107, 0.08)',
    overlay:          'rgba(15, 23, 42, 0.50)',
    skeleton:         palette.slate200,
    skeletonHighlight: palette.slate100,

    ...stateColors,
  },
  typography: {
    fontFamily: {
      heading: 'Nunito',
      body: 'Merriweather',
      mono: 'SpaceMono',
    },
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  },
  spacing,
  borderRadius,
  shadows: shadowsLight,
  animation: { duration: animationDuration, easing: animationEasing },
  components,
  zIndex,
  breakpoints,
};

// ── Dark Theme ────────────────────────────────────────────────
export const educationalDark: DreamcrafterTheme = {
  ...educationalLight,
  mode: 'dark',
  colors: {
    primary:          palette.blue300,
    primaryLight:     'rgba(27, 58, 107, 0.25)',
    primaryDark:      palette.blue500,
    secondary:        palette.gold400,
    secondaryLight:   'rgba(240, 165, 0, 0.20)',
    secondaryDark:    palette.gold300,
    accent:           palette.teal400,

    background:       '#0E1827',  // deep navy — immersive study mode
    surface:          '#16253D',
    surfaceRaised:    '#1E3154',
    surfaceSunken:    '#0A1220',

    textPrimary:      '#E8EFF8',
    textSecondary:    palette.slate400,
    textDisabled:     palette.slate600,
    textInverse:      palette.slate900,
    textLink:         palette.blue300,

    border:           'rgba(255,255,255,0.10)',
    borderStrong:     'rgba(255,255,255,0.18)',
    borderFocus:      palette.gold400,

    ripple:           'rgba(78, 205, 196, 0.12)',
    overlay:          'rgba(0, 0, 0, 0.70)',
    skeleton:         '#1E3154',
    skeletonHighlight: '#263F60',

    ...stateColors,
  },
  shadows: shadowsDark,
};
