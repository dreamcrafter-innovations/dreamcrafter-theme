// ============================================================
// DREAMCRAFTER — Utility Genre Theme
// Apps: Pressure Cooker Timer, Pooja Reminder, Emergency Contacts, School Timetable
// Colors: Slate #2D3748 + Teal #319795 + Gold #F0A500
// Fonts: Inter (headings) + Source Sans Pro (body)
// Feel: Clean, efficient, reliable, calm, no-nonsense, trustworthy
// ============================================================

import type { DreamcrafterTheme, Shadows, BorderRadius, ComponentTokens } from '../types';
import {
  spacing, fontSize, fontWeight, lineHeight, letterSpacing,
  animationDuration, animationEasing, zIndex, breakpoints,
  stateColors, sharedComponentTokens,
} from '../tokens';

// ── Raw palette ──────────────────────────────────────────────
const palette = {
  slate50:    '#F8FAFC',
  slate100:   '#F1F5F9',
  slate200:   '#E2E8F0',
  slate300:   '#CBD5E1',
  slate400:   '#94A3B8',
  slate500:   '#64748B',
  slate600:   '#475569',
  slate700:   '#334155',
  slate800:   '#1E293B',
  slate850:   '#172033',
  slate900:   '#0F172A',
  teal50:     '#E6FFFA',
  teal100:    '#B2F5EA',
  teal200:    '#81E6D9',
  teal300:    '#4FD1C5',
  teal400:    '#319795',   // SECONDARY
  teal500:    '#2C7A7B',
  teal600:    '#285E61',
  gold400:    '#F0A500',   // ACCENT
  gold500:    '#D48F00',
  slate2D:    '#2D3748',   // PRIMARY (exact brand hex)
  white:      '#FFFFFF',
};

// ── Border Radius ────────────────────────────────────────────
// Utility: minimal radius — clean, functional, professional
const borderRadius: BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// ── Shadows ──────────────────────────────────────────────────
// Utility shadows are subtle and neutral — don't distract
const shadowsLight: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: palette.slate2D, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  sm:   { shadowColor: palette.slate2D, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  md:   { shadowColor: palette.slate2D, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  lg:   { shadowColor: palette.slate2D, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 16, elevation: 8 },
  xl:   { shadowColor: palette.slate2D, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 16 },
};

const shadowsDark: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 2, elevation: 1 },
  sm:   { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.24, shadowRadius: 4, elevation: 2 },
  md:   { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 4 },
  lg:   { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.32, shadowRadius: 16, elevation: 8 },
  xl:   { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.38, shadowRadius: 24, elevation: 16 },
};

// ── Component Tokens ─────────────────────────────────────────
// Utility uses sharper edges and standard sizing — no-frills
const components: ComponentTokens = {
  ...sharedComponentTokens,
  button: { ...sharedComponentTokens.button, borderRadius: borderRadius.sm },
  input:  { ...sharedComponentTokens.input,  borderRadius: borderRadius.sm },
  card:   { padding: spacing[4], borderRadius: borderRadius.md, borderWidth: 1 },
  badge:  { ...sharedComponentTokens.badge,  borderRadius: borderRadius.xs },
  bottomSheet: { ...sharedComponentTokens.bottomSheet, borderRadius: borderRadius.lg },
  tabBar: sharedComponentTokens.tabBar,
  header: sharedComponentTokens.header,
  avatar: sharedComponentTokens.avatar,
  icon:   sharedComponentTokens.icon,
};

// ── Light Theme ───────────────────────────────────────────────
export const utilityLight: DreamcrafterTheme = {
  genre: 'utility',
  mode: 'light',
  colors: {
    primary:          palette.slate2D,
    primaryLight:     palette.slate200,
    primaryDark:      palette.slate800,
    secondary:        palette.teal400,
    secondaryLight:   palette.teal50,
    secondaryDark:    palette.teal600,
    accent:           palette.gold400,

    background:       palette.slate50,
    surface:          palette.white,
    surfaceRaised:    palette.white,
    surfaceSunken:    palette.slate100,

    textPrimary:      palette.slate800,
    textSecondary:    palette.slate500,
    textDisabled:     palette.slate300,
    textInverse:      palette.white,
    textLink:         palette.teal400,

    border:           palette.slate200,
    borderStrong:     palette.slate300,
    borderFocus:      palette.teal400,

    ripple:           'rgba(45, 55, 72, 0.07)',
    overlay:          'rgba(15, 23, 42, 0.48)',
    skeleton:         palette.slate200,
    skeletonHighlight: palette.slate100,

    ...stateColors,
  },
  typography: {
    fontFamily: {
      heading: 'Inter',
      body: 'SourceSansPro',
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
  animation: {
    duration: {
      ...animationDuration,
      normal: 200,  // utility apps feel snappier
    },
    easing: {
      ...animationEasing,
      easeOut: animationEasing.smooth,  // smooth, not bouncy
    },
  },
  components,
  zIndex,
  breakpoints,
};

// ── Dark Theme ────────────────────────────────────────────────
export const utilityDark: DreamcrafterTheme = {
  ...utilityLight,
  mode: 'dark',
  colors: {
    primary:          palette.teal300,    // in dark mode, teal leads — slate is too dark
    primaryLight:     'rgba(49, 151, 149, 0.20)',
    primaryDark:      palette.teal400,
    secondary:        palette.teal400,
    secondaryLight:   'rgba(79, 209, 197, 0.15)',
    secondaryDark:    palette.teal600,
    accent:           palette.gold400,

    background:       '#111820',    // deep neutral — purposeful dark
    surface:          '#1A2333',
    surfaceRaised:    '#223045',
    surfaceSunken:    '#0D1319',

    textPrimary:      '#E2ECF8',
    textSecondary:    palette.slate400,
    textDisabled:     palette.slate600,
    textInverse:      palette.slate900,
    textLink:         palette.teal300,

    border:           'rgba(255,255,255,0.08)',
    borderStrong:     'rgba(255,255,255,0.15)',
    borderFocus:      palette.teal300,

    ripple:           'rgba(79, 209, 197, 0.10)',
    overlay:          'rgba(0, 0, 0, 0.68)',
    skeleton:         '#1A2333',
    skeletonHighlight: '#223045',

    ...stateColors,
  },
  shadows: shadowsDark,
};
