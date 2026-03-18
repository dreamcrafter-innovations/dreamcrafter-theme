// ============================================================
// DREAMCRAFTER — Kids & Family Genre Theme
// Apps: Girls presenter videos, Story Builder, My First Journal, Family Chore Tracker
// Colors: Coral #FF6B6B + Teal #4ECDC4 + Yellow #FFE66D
// Fonts: Poppins (all text, extra letter-spacing)
// Feel: Warm, joyful, safe, soft, imaginative, nurturing
// ============================================================

import type { DreamcrafterTheme, Shadows, BorderRadius, ComponentTokens } from '../types';
import {
  spacing, fontSize, fontWeight, lineHeight, letterSpacing,
  animationDuration, animationEasing, zIndex, breakpoints,
  stateColors, sharedComponentTokens,
} from '../tokens';

// ── Raw palette ──────────────────────────────────────────────
const palette = {
  coral50:    '#FFF5F5',
  coral100:   '#FFD6D6',
  coral200:   '#FFB0B0',
  coral300:   '#FF8E8E',
  coral400:   '#FF6B6B',   // PRIMARY
  coral500:   '#EE4B4B',
  coral600:   '#D42F2F',
  teal50:     '#E6FFFE',
  teal100:    '#C0FAF7',
  teal200:    '#81F5F0',
  teal300:    '#4ECDC4',   // SECONDARY
  teal400:    '#38B2A8',
  teal500:    '#24887F',
  yellow50:   '#FFFDF0',
  yellow100:  '#FFF9C4',
  yellow200:  '#FFF49A',
  yellow300:  '#FFE66D',   // ACCENT
  yellow400:  '#FFD94A',
  yellow500:  '#F5C500',
  white:      '#FFFFFF',
  warm50:     '#FEFAF8',
  warm100:    '#FEF3EE',
  slate300:   '#CBD5E1',
  slate400:   '#94A3B8',
  slate500:   '#64748B',
  slate700:   '#334155',
  slate800:   '#1E293B',
  // Dark mode — warm dark, not cold grey
  dark700:    '#2D1B1B',
  dark800:    '#201313',
  dark850:    '#160D0D',
  dark900:    '#0E0808',
};

// ── Border Radius ────────────────────────────────────────────
// Kids: VERY rounded — bubbly, soft, approachable, safe
const borderRadius: BorderRadius = {
  none: 0,
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  '2xl': 42,
  full: 9999,
};

// ── Shadows ──────────────────────────────────────────────────
// Soft, warm, colourful shadows — not harsh
const shadowsLight: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: palette.coral400, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 4, elevation: 1 },
  sm:   { shadowColor: palette.coral400, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 6, elevation: 2 },
  md:   { shadowColor: palette.coral400, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 4 },
  lg:   { shadowColor: palette.teal300,  shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 8 },
  xl:   { shadowColor: palette.teal300,  shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.22, shadowRadius: 30, elevation: 16 },
};

const shadowsDark: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 1 },
  sm:   { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.28, shadowRadius: 6, elevation: 2 },
  md:   { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.32, shadowRadius: 12, elevation: 4 },
  lg:   { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.38, shadowRadius: 20, elevation: 8 },
  xl:   { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 30, elevation: 16 },
};

// ── Component Tokens ─────────────────────────────────────────
// Kids gets larger touch targets + extra padding (small fingers)
const components: ComponentTokens = {
  ...sharedComponentTokens,
  button: {
    ...sharedComponentTokens.button,
    heightSm: 36,
    heightMd: 52,   // larger than default — easier for kids
    heightLg: 64,
    borderRadius: borderRadius.xl,
  },
  input:  {
    ...sharedComponentTokens.input,
    height: 56,     // larger inputs
    borderRadius: borderRadius.lg,
  },
  card:   { padding: spacing[5], borderRadius: borderRadius.xl, borderWidth: 0 }, // no border — softer look
  badge:  { ...sharedComponentTokens.badge, borderRadius: borderRadius.full },
  bottomSheet: { ...sharedComponentTokens.bottomSheet, borderRadius: borderRadius['2xl'] },
  tabBar: { ...sharedComponentTokens.tabBar, height: 68, iconSize: 28, labelSize: 11 },
  header: { height: 60, iconSize: 28 },
  avatar: sharedComponentTokens.avatar,
  icon:   { ...sharedComponentTokens.icon, md: 24, lg: 28 },
};

// ── Light Theme ───────────────────────────────────────────────
export const kidsLight: DreamcrafterTheme = {
  genre: 'kids',
  mode: 'light',
  colors: {
    primary:          palette.coral400,
    primaryLight:     palette.coral100,
    primaryDark:      palette.coral600,
    secondary:        palette.teal300,
    secondaryLight:   palette.teal100,
    secondaryDark:    palette.teal500,
    accent:           palette.yellow300,

    background:       palette.warm50,
    surface:          palette.white,
    surfaceRaised:    palette.white,
    surfaceSunken:    palette.warm100,

    textPrimary:      '#2D1616',
    textSecondary:    '#7A5A5A',
    textDisabled:     '#C4A4A4',
    textInverse:      palette.white,
    textLink:         palette.teal400,

    border:           '#FFD6D6',
    borderStrong:     '#FFBBBB',
    borderFocus:      palette.teal300,

    ripple:           'rgba(255, 107, 107, 0.10)',
    overlay:          'rgba(45, 22, 22, 0.45)',
    skeleton:         '#FFE8E8',
    skeletonHighlight: '#FFF5F5',

    ...stateColors,
  },
  typography: {
    fontFamily: {
      heading: 'Poppins',
      body: 'Poppins',
      mono: 'SpaceMono',
    },
    fontSize,
    fontWeight,
    lineHeight: {
      ...lineHeight,
      normal: 1.6,    // slightly more relaxed for kids readability
    },
    letterSpacing: {
      ...letterSpacing,
      normal: 0.3,    // kids text has slightly wider tracking per brand guide
      wide: 0.8,
    },
  },
  spacing,
  borderRadius,
  shadows: shadowsLight,
  animation: {
    duration: animationDuration,
    easing: {
      ...animationEasing,
      easeOut: animationEasing.spring,  // bouncy by default for kids
    },
  },
  components,
  zIndex,
  breakpoints,
};

// ── Dark Theme ────────────────────────────────────────────────
// Warm dark — like a cosy nightlight, not a cold dark mode
export const kidsDark: DreamcrafterTheme = {
  ...kidsLight,
  mode: 'dark',
  colors: {
    primary:          palette.coral300,
    primaryLight:     'rgba(255, 107, 107, 0.20)',
    primaryDark:      palette.coral400,
    secondary:        palette.teal300,
    secondaryLight:   'rgba(78, 205, 196, 0.18)',
    secondaryDark:    palette.teal400,
    accent:           palette.yellow300,

    background:       '#1A0E0E',    // warm charcoal
    surface:          palette.dark800,
    surfaceRaised:    palette.dark700,
    surfaceSunken:    palette.dark900,

    textPrimary:      '#FFE8E8',
    textSecondary:    '#C49898',
    textDisabled:     '#6A4A4A',
    textInverse:      '#1A0E0E',
    textLink:         palette.teal300,

    border:           'rgba(255, 107, 107, 0.20)',
    borderStrong:     'rgba(255, 107, 107, 0.35)',
    borderFocus:      palette.teal300,

    ripple:           'rgba(78, 205, 196, 0.12)',
    overlay:          'rgba(0, 0, 0, 0.70)',
    skeleton:         '#2D1818',
    skeletonHighlight: '#3D2020',

    ...stateColors,
  },
  shadows: shadowsDark,
};
