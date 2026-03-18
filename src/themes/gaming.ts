// ============================================================
// DREAMCRAFTER — Gaming & Apps Genre Theme
// Apps: Werewolf, Imposter, Charades, Pictionary, party games
// Colors: Purple #6C3FE8 + Neon Green #39FF14 + Red #FF6B6B
// Fonts: Fredoka One (headings) + Inter (body)
// Feel: Electric, playful, high-energy, social, competitive
// ============================================================

import type { DreamcrafterTheme, Shadows, BorderRadius, ComponentTokens } from '../types';
import {
  spacing, fontSize, fontWeight, lineHeight, letterSpacing,
  animationDuration, animationEasing, zIndex, breakpoints,
  stateColors, sharedComponentTokens,
} from '../tokens';

// ── Raw palette ──────────────────────────────────────────────
const palette = {
  purple50:   '#F5F0FF',
  purple100:  '#E4D9FF',
  purple200:  '#C8B3FF',
  purple300:  '#A880FF',
  purple400:  '#8A5CF6',
  purple500:  '#6C3FE8',  // PRIMARY
  purple600:  '#5730C4',
  purple700:  '#4122A0',
  purple800:  '#2C157C',
  purple900:  '#180B4E',
  neon50:     '#F0FFF0',
  neon100:    '#CCFFCC',
  neon200:    '#99FF99',
  neon300:    '#66FF66',
  neon400:    '#39FF14',  // SECONDARY — neon green
  neon500:    '#2ED411',
  red400:     '#FF6B6B',  // ACCENT
  red500:     '#EE4444',
  white:      '#FFFFFF',
  dark50:     '#F0EBFF',
  dark100:    '#EDE8FF',
  dark700:    '#1A0A3D',
  dark800:    '#120730',
  dark850:    '#0D0522',
  dark900:    '#080316',
  gray300:    '#CBD5E1',
  gray400:    '#94A3B8',
  gray500:    '#64748B',
  gray600:    '#475569',
};

// ── Border Radius ────────────────────────────────────────────
// Gaming: more rounded — playful, inviting, fun
const borderRadius: BorderRadius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 36,
  full: 9999,
};

// ── Shadows ──────────────────────────────────────────────────
// Gaming shadows glow with the primary purple color
const shadowsLight: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: palette.purple500, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 1 },
  sm:   { shadowColor: palette.purple500, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 2 },
  md:   { shadowColor: palette.purple500, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 4 },
  lg:   { shadowColor: palette.purple500, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 8 },
  xl:   { shadowColor: palette.purple500, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 32, elevation: 16 },
};

const shadowsDark: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: palette.neon400, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.10, shadowRadius: 4, elevation: 1 },
  sm:   { shadowColor: palette.neon400, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 2 },
  md:   { shadowColor: palette.purple400, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 16, elevation: 4 },
  lg:   { shadowColor: palette.purple300, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.40, shadowRadius: 24, elevation: 8 },
  xl:   { shadowColor: palette.purple300, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.50, shadowRadius: 40, elevation: 16 },
};

// ── Component Tokens ─────────────────────────────────────────
const components: ComponentTokens = {
  ...sharedComponentTokens,
  button: { ...sharedComponentTokens.button, borderRadius: borderRadius.lg },
  input:  { ...sharedComponentTokens.input,  borderRadius: borderRadius.md },
  card:   { padding: spacing[4], borderRadius: borderRadius.xl, borderWidth: 1.5 },
  badge:  { ...sharedComponentTokens.badge,  borderRadius: borderRadius.full },
  bottomSheet: { ...sharedComponentTokens.bottomSheet, borderRadius: borderRadius['2xl'] },
  tabBar: sharedComponentTokens.tabBar,
  header: sharedComponentTokens.header,
  avatar: sharedComponentTokens.avatar,
  icon:   sharedComponentTokens.icon,
};

// ── Light Theme ───────────────────────────────────────────────
export const gamingLight: DreamcrafterTheme = {
  genre: 'gaming',
  mode: 'light',
  colors: {
    primary:          palette.purple500,
    primaryLight:     palette.purple100,
    primaryDark:      palette.purple700,
    secondary:        palette.neon400,
    secondaryLight:   palette.neon100,
    secondaryDark:    palette.neon500,
    accent:           palette.red400,

    background:       '#FAFAFA',
    surface:          palette.white,
    surfaceRaised:    palette.white,
    surfaceSunken:    palette.dark50,

    textPrimary:      '#1A1230',
    textSecondary:    palette.gray500,
    textDisabled:     palette.gray300,
    textInverse:      palette.white,
    textLink:         palette.purple500,

    border:           '#E8E0FF',
    borderStrong:     '#D0C0FF',
    borderFocus:      palette.neon400,

    ripple:           'rgba(108, 63, 232, 0.10)',
    overlay:          'rgba(8, 3, 22, 0.55)',
    skeleton:         '#EDE8FF',
    skeletonHighlight: '#F5F0FF',

    ...stateColors,
  },
  typography: {
    fontFamily: {
      heading: 'Fredoka One',
      body: 'Inter',
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
    duration: animationDuration,
    easing: {
      ...animationEasing,
      // Gaming uses bouncier/snappier defaults
      easeOut: animationEasing.spring,
    },
  },
  components,
  zIndex,
  breakpoints,
};

// ── Dark Theme ────────────────────────────────────────────────
// Dark is THE primary mode for gaming — arcade aesthetic
export const gamingDark: DreamcrafterTheme = {
  ...gamingLight,
  mode: 'dark',
  colors: {
    primary:          palette.purple300,
    primaryLight:     'rgba(108, 63, 232, 0.25)',
    primaryDark:      palette.purple500,
    secondary:        palette.neon400,
    secondaryLight:   'rgba(57, 255, 20, 0.15)',
    secondaryDark:    palette.neon300,
    accent:           palette.red400,

    background:       palette.dark850,  // deep dark purple-black
    surface:          palette.dark800,
    surfaceRaised:    palette.dark700,
    surfaceSunken:    palette.dark900,

    textPrimary:      '#F0EAFF',
    textSecondary:    '#9D8FC0',
    textDisabled:     '#4A3A6A',
    textInverse:      palette.dark900,
    textLink:         palette.purple300,

    border:           'rgba(108, 63, 232, 0.25)',
    borderStrong:     'rgba(108, 63, 232, 0.45)',
    borderFocus:      palette.neon400,

    ripple:           'rgba(57, 255, 20, 0.12)',
    overlay:          'rgba(0, 0, 0, 0.75)',
    skeleton:         '#1A0A3D',
    skeletonHighlight: '#221050',

    ...stateColors,
  },
  shadows: shadowsDark,
};
