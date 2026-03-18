// ============================================================
// DREAMCRAFTER — Responsive System
//
// Handles phones, tablets (7–10"), and web at one breakpoint
// set. All values snap cleanly to the 4px spacing grid.
//
// PHONE:   0–767dp  — default theme.components tokens apply
// TABLET:  768dp+   — override tokens below apply
// DESKTOP: 1024dp+  — web / large tablet landscape
//
// Usage:
//   const { isTablet, isDesktop, responsive, columns } = useResponsive();
//   const padding = responsive({ phone: 16, tablet: 32, desktop: 48 });
//   <FlatList numColumns={columns(2, 3, 4)} ... />
// ============================================================

import { useWindowDimensions, PixelRatio, Platform } from 'react-native';
import { useMemo } from 'react';
import type { ComponentTokens } from './types';
import { sharedComponentTokens, spacing } from './tokens';

// ── Breakpoint values (dp / css px) ─────────────────────────
export const BREAKPOINTS = {
  phone:   0,
  tablet:  768,
  desktop: 1024,
} as const;

// ── useResponsive hook ───────────────────────────────────────
export interface ResponsiveContext {
  width: number;
  height: number;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  fontScale: number;    // system font size multiplier
  pixelRatio: number;

  /**
   * Pick a value based on screen width. Falls back to the smallest
   * matching tier if larger ones aren't provided.
   *
   *   responsive({ phone: 16, tablet: 32 })
   *   // → 16 on phone, 32 on tablet + desktop
   */
  responsive: <T>(values: { phone: T; tablet?: T; desktop?: T }) => T;

  /**
   * Shorthand: pick column count for FlatList numColumns.
   *
   *   columns(2, 3, 4)
   *   // → 2 on phone, 3 on tablet, 4 on desktop
   */
  columns: (phone: number, tablet?: number, desktop?: number) => number;

  /**
   * Normalise a font size to account for system font scaling.
   * Clamps multiplier to max 1.4 to avoid layout breaking.
   *
   *   scaledFont(16) → 16 at default scale, up to 22.4 at max scale
   */
  scaledFont: (size: number) => number;

  /**
   * Responsive component tokens — phone tokens auto-upgrade to
   * tablet tokens on wider screens.
   */
  componentTokens: ComponentTokens;
}

export function useResponsive(): ResponsiveContext {
  const { width, height, fontScale } = useWindowDimensions();
  const pixelRatio = PixelRatio.get();

  return useMemo(() => {
    const isPhone   = width < BREAKPOINTS.tablet;
    const isTablet  = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
    const isDesktop = width >= BREAKPOINTS.desktop;
    const isLandscape = width > height;

    function responsive<T>(values: { phone: T; tablet?: T; desktop?: T }): T {
      if (isDesktop && values.desktop !== undefined) return values.desktop;
      if (!isPhone && values.tablet !== undefined) return values.tablet;
      return values.phone;
    }

    function columns(phone: number, tablet = phone, desktop = tablet): number {
      if (isDesktop) return desktop;
      if (!isPhone) return tablet;
      return phone;
    }

    function scaledFont(size: number): number {
      const clampedScale = Math.min(fontScale, 1.4);
      return Math.round(size * clampedScale);
    }

    const componentTokens = responsive({
      phone:   phoneComponentTokens,
      tablet:  tabletComponentTokens,
      desktop: desktopComponentTokens,
    });

    return {
      width, height, isPhone, isTablet, isDesktop,
      isLandscape, isPortrait: !isLandscape,
      fontScale, pixelRatio,
      responsive, columns, scaledFont,
      componentTokens,
    };
  }, [width, height, fontScale, pixelRatio]);
}

// ── Phone Component Tokens ───────────────────────────────────
// Same as sharedComponentTokens — phone is the default
const phoneComponentTokens: ComponentTokens = {
  ...sharedComponentTokens,
  button: { ...sharedComponentTokens.button, borderRadius: 10 },
  input:  { ...sharedComponentTokens.input,  borderRadius: 8 },
  card:   { padding: spacing[4], borderRadius: 14, borderWidth: 1 },
  badge:  { ...sharedComponentTokens.badge,  borderRadius: 9999 },
  bottomSheet:   { ...sharedComponentTokens.bottomSheet, borderRadius: 24 },
  tabBar: sharedComponentTokens.tabBar,
  header: sharedComponentTokens.header,
  avatar: sharedComponentTokens.avatar,
  icon:   sharedComponentTokens.icon,
};

// ── Tablet Component Tokens ──────────────────────────────────
// Tablet gets: larger buttons, more card padding, bigger icons,
// taller header, wider inputs. Everything stays on the 4px grid.
const tabletComponentTokens: ComponentTokens = {
  ...sharedComponentTokens,
  button: {
    heightSm: 36,
    heightMd: 52,
    heightLg: 64,
    paddingHorizontalSm: 16,
    paddingHorizontalMd: 28,
    paddingHorizontalLg: 40,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  input: {
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  card: {
    padding: spacing[6],          // 24px on tablet vs 16px on phone
    borderRadius: 18,
    borderWidth: 1,
  },
  badge: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  bottomSheet: {
    handleWidth: 48,
    handleHeight: 5,
    borderRadius: 28,
  },
  tabBar: {
    height: 72,
    iconSize: 28,
    labelSize: 12,
  },
  header: {
    height: 64,
    iconSize: 28,
  },
  avatar: {
    xs: 28,
    sm: 40,
    md: 56,
    lg: 80,
    xl: 120,
  },
  icon: {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 30,
    xl: 40,
  },
};

// ── Desktop/Web Component Tokens ─────────────────────────────
const desktopComponentTokens: ComponentTokens = {
  ...tabletComponentTokens,
  button: {
    ...tabletComponentTokens.button,
    heightMd: 48,
    heightLg: 60,
    borderRadius: 8,    // web tends toward sharper
  },
  card: {
    padding: spacing[8],    // 32px
    borderRadius: 16,
    borderWidth: 1,
  },
  tabBar: {
    height: 0,    // desktop uses sidebar nav, not bottom tab bar
    iconSize: 24,
    labelSize: 13,
  },
};

// ── Responsive font sizes ─────────────────────────────────────
/**
 * Tablet and desktop get slightly larger base font sizes.
 * Use with useResponsive().responsive() or directly.
 */
export const responsiveFontSize = {
  phone: {
    xs: 11, sm: 13, md: 15, lg: 17, xl: 20,
    '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48,
  },
  tablet: {
    xs: 12, sm: 14, md: 16, lg: 18, xl: 22,
    '2xl': 26, '3xl': 32, '4xl': 40, '5xl': 54,
  },
  desktop: {
    xs: 12, sm: 14, md: 16, lg: 18, xl: 22,
    '2xl': 28, '3xl': 34, '4xl': 44, '5xl': 60,
  },
} as const;

// ── Grid helpers ─────────────────────────────────────────────
/**
 * Calculates the width of a grid column given the screen width,
 * number of columns, and gutter spacing.
 *
 * Usage:
 *   const { width } = useResponsive();
 *   const colWidth = gridColumnWidth(width, 2, 16, 12);
 *   // → (width - 2*16 - 1*12) / 2
 */
export function gridColumnWidth(
  screenWidth: number,
  numColumns: number,
  horizontalPadding: number,
  gutterSize: number,
): number {
  const totalGutters = (numColumns - 1) * gutterSize;
  const totalPadding = horizontalPadding * 2;
  return (screenWidth - totalPadding - totalGutters) / numColumns;
}

// ── Scale utilities (for adaptive sizing) ───────────────────
/**
 * Scale a dp value proportionally to the phone baseline (375dp).
 * Use for sizes that should genuinely grow on larger screens,
 * not just snap to breakpoints.
 *
 * Example: a hero image that should be proportionally larger on tablets.
 * DO NOT use for text — use scaledFont() from useResponsive() instead.
 */
export function scaleSize(size: number, screenWidth: number, baseWidth = 375): number {
  return Math.round(size * (screenWidth / baseWidth));
}

/**
 * Clamp scaleSize between min and max to prevent extremes.
 */
export function clampScale(
  size: number,
  screenWidth: number,
  min: number,
  max: number,
  baseWidth = 375,
): number {
  const scaled = scaleSize(size, screenWidth, baseWidth);
  return Math.min(Math.max(scaled, min), max);
}
