// ============================================================
// DREAMCRAFTER — India Regional Genre Theme
// Apps: Pressure Cooker Timer (India-first), Pooja Reminder,
//       Family Trivia Night (India pack), Spelling Bee Jr., regional apps
// Colors: Saffron #FF6B35 + Marigold #FCBF49 + Teal #2EC4B6
// Fonts: Poppins + Noto Sans (Telugu/Hindi/Tamil/Kannada scripts)
// Feel: Vibrant, celebratory, warm, rooted, festive but not kitsch
// ============================================================

import type { DreamcrafterTheme, Shadows, BorderRadius, ComponentTokens } from '../types';
import {
  spacing, fontSize, fontWeight, lineHeight, letterSpacing,
  animationDuration, animationEasing, zIndex, breakpoints,
  stateColors, sharedComponentTokens,
} from '../tokens';

// ── Raw palette ──────────────────────────────────────────────
const palette = {
  saffron50:    '#FFF5F0',
  saffron100:   '#FFE0D0',
  saffron200:   '#FFC0A0',
  saffron300:   '#FF9B70',
  saffron400:   '#FF6B35',   // PRIMARY — saffron
  saffron500:   '#E85520',
  saffron600:   '#C44010',
  marigold50:   '#FFFBF0',
  marigold100:  '#FFF3D0',
  marigold200:  '#FFE49A',
  marigold300:  '#FCBF49',   // SECONDARY — marigold gold
  marigold400:  '#F5A500',
  marigold500:  '#D68800',
  teal50:       '#E6FFFE',
  teal200:      '#72E9E3',
  teal300:      '#2EC4B6',   // ACCENT
  teal400:      '#22A89A',
  teal500:      '#177A6E',
  white:        '#FFFFFF',
  cream50:      '#FFFDF8',
  cream100:     '#FFF8EC',
  warm800:      '#2D1A08',
  warm850:      '#200E04',
  warm900:      '#140800',
  slate300:     '#CBD5E1',
  slate400:     '#94A3B8',
  slate500:     '#64748B',
};

// ── Border Radius ────────────────────────────────────────────
// India Regional: moderate-generous radius — warm, inviting
const borderRadius: BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

// ── Shadows ──────────────────────────────────────────────────
// Warm-toned shadows with saffron undertone — festive depth
const shadowsLight: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: palette.saffron400, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  sm:   { shadowColor: palette.saffron400, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  md:   { shadowColor: palette.saffron400, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 },
  lg:   { shadowColor: palette.marigold300, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 8 },
  xl:   { shadowColor: palette.marigold300, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.22, shadowRadius: 28, elevation: 16 },
};

const shadowsDark: Shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  xs:   { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 3, elevation: 1 },
  sm:   { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.28, shadowRadius: 6, elevation: 2 },
  md:   { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.32, shadowRadius: 10, elevation: 4 },
  lg:   { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 18, elevation: 8 },
  xl:   { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.44, shadowRadius: 28, elevation: 16 },
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
export const indiaRegionalLight: DreamcrafterTheme = {
  genre: 'indiaRegional',
  mode: 'light',
  colors: {
    primary:          palette.saffron400,
    primaryLight:     palette.saffron100,
    primaryDark:      palette.saffron600,
    secondary:        palette.marigold300,
    secondaryLight:   palette.marigold100,
    secondaryDark:    palette.marigold500,
    accent:           palette.teal300,

    background:       palette.cream50,
    surface:          palette.white,
    surfaceRaised:    palette.white,
    surfaceSunken:    palette.cream100,

    textPrimary:      '#2D1A08',
    textSecondary:    '#7A5A38',
    textDisabled:     '#C4A882',
    textInverse:      palette.white,
    textLink:         palette.teal400,

    border:           '#FFDEC8',
    borderStrong:     '#FFC8A0',
    borderFocus:      palette.teal300,

    ripple:           'rgba(255, 107, 53, 0.10)',
    overlay:          'rgba(45, 26, 8, 0.50)',
    skeleton:         '#FFE8D8',
    skeletonHighlight: '#FFF5F0',

    ...stateColors,
  },
  typography: {
    fontFamily: {
      heading: 'Poppins',
      body: 'Poppins',
      mono: 'SpaceMono',
      regional: 'NotoSans',    // covers Telugu, Hindi, Tamil, Kannada glyphs
    },
    fontSize,
    fontWeight,
    lineHeight: {
      ...lineHeight,
      normal: 1.6,  // extra line height helps Indic script readability
    },
    letterSpacing,
  },
  spacing,
  borderRadius,
  shadows: shadowsLight,
  animation: {
    duration: animationDuration,
    easing: animationEasing,
  },
  components,
  zIndex,
  breakpoints,
};

// ── Dark Theme ────────────────────────────────────────────────
export const indiaRegionalDark: DreamcrafterTheme = {
  ...indiaRegionalLight,
  mode: 'dark',
  colors: {
    primary:          palette.saffron300,
    primaryLight:     'rgba(255, 107, 53, 0.22)',
    primaryDark:      palette.saffron400,
    secondary:        palette.marigold300,
    secondaryLight:   'rgba(252, 191, 73, 0.18)',
    secondaryDark:    palette.marigold400,
    accent:           palette.teal300,

    background:       '#1C1008',    // deep warm dark — like a lamp-lit room
    surface:          palette.warm850,
    surfaceRaised:    palette.warm800,
    surfaceSunken:    palette.warm900,

    textPrimary:      '#FFE8D0',
    textSecondary:    '#C49870',
    textDisabled:     '#6A4A28',
    textInverse:      '#1C1008',
    textLink:         palette.teal300,

    border:           'rgba(255, 107, 53, 0.22)',
    borderStrong:     'rgba(252, 191, 73, 0.35)',
    borderFocus:      palette.teal300,

    ripple:           'rgba(46, 196, 182, 0.12)',
    overlay:          'rgba(0, 0, 0, 0.70)',
    skeleton:         '#2A1608',
    skeletonHighlight: '#3A2010',

    ...stateColors,
  },
  shadows: shadowsDark,
};
