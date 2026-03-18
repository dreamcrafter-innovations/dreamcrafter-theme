// ============================================================
// DREAMCRAFTER — Shared Design Tokens
// These values are IDENTICAL across all genres and modes.
// Only import genre-specific overrides from theme files.
// ============================================================

import type {
  Spacing,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  AnimationDuration,
  AnimationEasing,
  ZIndex,
  Breakpoints,
} from './types';

// ── Spacing (4px base grid) ──────────────────────────────────
export const spacing: Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

// ── Font Sizes ───────────────────────────────────────────────
export const fontSize: FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// ── Font Weights ─────────────────────────────────────────────
export const fontWeight: FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// ── Line Heights ─────────────────────────────────────────────
export const lineHeight: LineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

// ── Letter Spacing ───────────────────────────────────────────
export const letterSpacing: LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.2,
};

// ── Animation ────────────────────────────────────────────────
export const animationDuration: AnimationDuration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
};

export const animationEasing: AnimationEasing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // bouncy
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',        // premium
};

// ── Z-Index ──────────────────────────────────────────────────
export const zIndex: ZIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
};

// ── Breakpoints ──────────────────────────────────────────────
export const breakpoints: Breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
};

// ── Semantic State Colors (same across ALL genres) ────────────
// These NEVER change — genre colors cannot override these.
export const stateColors = {
  error: '#E53E3E',
  errorLight: '#FFF5F5',
  success: '#38A169',
  successLight: '#F0FFF4',
  warning: '#D69E2E',
  warningLight: '#FFFFF0',
  info: '#3182CE',
  infoLight: '#EBF8FF',
} as const;

// ── Component Tokens (shared defaults) ───────────────────────
// Genres can override borderRadius to match their personality
export const sharedComponentTokens = {
  button: {
    heightSm: 32,
    heightMd: 44,
    heightLg: 56,
    paddingHorizontalSm: 12,
    paddingHorizontalMd: 20,
    paddingHorizontalLg: 28,
    borderWidth: 1.5,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  badge: {
    height: 22,
    paddingHorizontal: 8,
  },
  bottomSheet: {
    handleWidth: 40,
    handleHeight: 4,
  },
  tabBar: {
    height: 60,
    iconSize: 24,
    labelSize: 10,
  },
  header: {
    height: 56,
    iconSize: 24,
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 44,
    lg: 64,
    xl: 96,
  },
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;
