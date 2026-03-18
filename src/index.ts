// ============================================================
// DREAMCRAFTER — @dreamcrafter/theme
// Single entry point — import everything from here.
//
// Usage in any app:
//   import {
//     ThemeProvider, useTheme, makeStyles,
//     DcText, DcView, DcButton, DcInput, DcBadge, DcDivider, DcIcon,
//     FontLoader,
//     themes, getTheme,
//   } from '@dreamcrafter/theme';
// ============================================================

// Types
export type {
  DreamcrafterTheme,
  GenreKey,
  ColorMode,
  SemanticColors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentTokens,
  AnimationDuration,
  AnimationEasing,
  Animation,
  ZIndex,
  Breakpoints,
  FontFamily,
} from './types';

// Theme provider + hook
export { ThemeProvider, useTheme, makeStyles, themes, getTheme } from './ThemeProvider';

// Shared tokens (for edge cases where theme context isn't available)
export {
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  zIndex,
  breakpoints,
  stateColors,
  sharedComponentTokens,
} from './tokens';

// Individual themes (for SSR or testing)
export { educationalLight, educationalDark } from './themes/educational';
export { gamingLight, gamingDark } from './themes/gaming';
export { kidsLight, kidsDark } from './themes/kids';
export { utilityLight, utilityDark } from './themes/utility';
export { indiaRegionalLight, indiaRegionalDark } from './themes/indiaRegional';

// Icons + fonts
export { DcIcon, FontLoader, FONT_FAMILIES, getIconName, resolveFontFamily } from './icons-fonts';
export type { IconName } from './icons-fonts';

// Primitive components
export { DcView, DcText, DcButton, DcInput, DcDivider, DcBadge } from './components/primitives';

// Platform utilities (shadow splitting, Android font weight, ripple, keyboard)
export {
  IS_IOS, IS_ANDROID, IS_WEB, ANDROID_API,
  platformShadow, shadowStyle,
  androidFontWeight,
  rippleConfig,
  keyboardBehavior, keyboardVerticalOffset,
  statusBarStyle,
  HIT_SLOP_SM, HIT_SLOP_MD, HIT_SLOP_LG,
} from './platform';

// Responsive system (breakpoints, tablet layout, grid helpers)
export {
  BREAKPOINTS,
  useResponsive,
  responsiveFontSize,
  gridColumnWidth,
  scaleSize, clampScale,
} from './responsive';
export type { ResponsiveContext } from './responsive';

// Safe area & screen layout (notch, Dynamic Island, nav bar, keyboard)
export {
  SafeAreaProvider,
  DcScreen, DcScrollScreen,
  DcTabBarSpacer, DcHeaderSafeArea, DcBottomSheetSafeArea,
  useSafeInsets,
} from './safeArea';

// Web utilities (safe to import on all platforms — no-ops on native)
export {
  IS_WEB,
  injectWebBaseline, injectGoogleFonts, injectThemeCSSVars,
  useHover,
  webInteractiveStyle, webTransition, webCursor, webOnly,
  webFocusRing, webMaxWidth,
} from './web';

// Web layout components
export {
  DcAppShell, DcSidebarLayout, DcBottomTabLayout,
  DcWebContainer, DcWebTopNav,
} from './webLayout';
export type { NavItem } from './webLayout';

// Animation compatibility (useNativeDriver, LayoutAnimation, game hooks)
export {
  nativeDriver, animConfig,
  animateLayout,
  usePressScale, usePressOpacity,
  useCardFlip, useShakeAnimation, usePulseAnimation,
  useFadeIn, useStaggeredEntrance,
  enableAndroidLayoutAnimation,
} from './animations';
