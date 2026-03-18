// ============================================================
// DREAMCRAFTER INNOVATIONS LLC — Theme Type Definitions
// All apps consume these types. Never change shape without
// updating every theme implementation.
// ============================================================

export type GenreKey =
  | 'educational'
  | 'gaming'
  | 'kids'
  | 'utility'
  | 'indiaRegional';

export type ColorMode = 'light' | 'dark';

// ── Color Palette ────────────────────────────────────────────
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;   // base
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;

  // Surfaces
  background: string;
  surface: string;        // cards, sheets
  surfaceRaised: string;  // modals, tooltips
  surfaceSunken: string;  // inputs, code blocks

  // Text
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;    // text on primary color backgrounds
  textLink: string;

  // Borders
  border: string;
  borderStrong: string;
  borderFocus: string;    // focus ring

  // State — SAME across all genres (brand consistency)
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;

  // Interaction
  ripple: string;         // touch ripple overlay
  overlay: string;        // modal backdrop
  skeleton: string;       // loading skeleton base
  skeletonHighlight: string;
}

// ── Typography ───────────────────────────────────────────────
export interface FontFamily {
  heading: string;
  body: string;
  mono: string;
  // For India Regional: regional script font
  regional?: string;
}

export interface FontSize {
  xs: number;    // 11
  sm: number;    // 13
  md: number;    // 15
  lg: number;    // 17
  xl: number;    // 20
  '2xl': number; // 24
  '3xl': number; // 30
  '4xl': number; // 36
  '5xl': number; // 48
}

export interface FontWeight {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  extraBold: string;
}

export interface LineHeight {
  tight: number;   // 1.1
  snug: number;    // 1.25
  normal: number;  // 1.5
  relaxed: number; // 1.75
}

export interface LetterSpacing {
  tight: number;
  normal: number;
  wide: number;
  wider: number;
}

export interface Typography {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
}

// ── Spacing ──────────────────────────────────────────────────
// 4px base grid — every value is a multiple of 4
export interface Spacing {
  0: number;   // 0
  1: number;   // 4
  2: number;   // 8
  3: number;   // 12
  4: number;   // 16
  5: number;   // 20
  6: number;   // 24
  8: number;   // 32
  10: number;  // 40
  12: number;  // 48
  16: number;  // 64
  20: number;  // 80
  24: number;  // 96
  32: number;  // 128
}

// ── Border Radius ────────────────────────────────────────────
export interface BorderRadius {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;  // 9999 — pill / circle
}

// ── Shadows ──────────────────────────────────────────────────
export interface ShadowValue {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

export interface Shadows {
  none: ShadowValue;
  xs: ShadowValue;
  sm: ShadowValue;
  md: ShadowValue;
  lg: ShadowValue;
  xl: ShadowValue;
}

// ── Animation ────────────────────────────────────────────────
export interface AnimationDuration {
  instant: number;  // 0
  fast: number;     // 150ms
  normal: number;   // 250ms
  slow: number;     // 400ms
  slower: number;   // 600ms
}

export interface AnimationEasing {
  // Cubic bezier string values for Reanimated / Animated
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  spring: string;     // bouncy — kids/gaming
  smooth: string;     // premium — utility/educational
}

export interface Animation {
  duration: AnimationDuration;
  easing: AnimationEasing;
}

// ── Component Tokens ─────────────────────────────────────────
// Keeps button/input/card dimensions consistent within a genre
export interface ComponentTokens {
  button: {
    heightSm: number;
    heightMd: number;
    heightLg: number;
    paddingHorizontalSm: number;
    paddingHorizontalMd: number;
    paddingHorizontalLg: number;
    borderRadius: number;
    borderWidth: number;
  };
  input: {
    height: number;
    paddingHorizontal: number;
    borderRadius: number;
    borderWidth: number;
  };
  card: {
    padding: number;
    borderRadius: number;
    borderWidth: number;
  };
  badge: {
    height: number;
    paddingHorizontal: number;
    borderRadius: number;
  };
  bottomSheet: {
    handleWidth: number;
    handleHeight: number;
    borderRadius: number;
  };
  tabBar: {
    height: number;
    iconSize: number;
    labelSize: number;
  };
  header: {
    height: number;
    iconSize: number;
  };
  avatar: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  icon: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// ── Z-Index ──────────────────────────────────────────────────
export interface ZIndex {
  hide: number;     // -1
  base: number;     // 0
  raised: number;   // 10
  dropdown: number; // 100
  sticky: number;   // 200
  overlay: number;  // 300
  modal: number;    // 400
  toast: number;    // 500
  tooltip: number;  // 600
}

// ── Breakpoints ──────────────────────────────────────────────
export interface Breakpoints {
  phone: number;   // 0
  tablet: number;  // 768
  desktop: number; // 1024
}

// ── Full Theme Object ────────────────────────────────────────
export interface DreamcrafterTheme {
  genre: GenreKey;
  mode: ColorMode;
  colors: SemanticColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: Animation;
  components: ComponentTokens;
  zIndex: ZIndex;
  breakpoints: Breakpoints;
}
