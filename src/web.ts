// ============================================================
// DREAMCRAFTER — Web Utilities
//
// React Native Web compiles RN styles to CSS, but several
// things just don't cross over:
//
// GAP 1 — Global CSS baseline
//   RN Web ships with no CSS reset. Browser defaults (margins,
//   box-sizing, focus rings, scrollbars) bleed through.
//   → injectWebBaseline() fixes this once at app start.
//
// GAP 2 — Hover states
//   RN `Pressable` doesn't expose :hover on web. Buttons look
//   dead — no visual response until you actually click.
//   → useHover() and webInteractiveStyle() fix this.
//
// GAP 3 — CSS transitions
//   Background/color changes snap instantly on web. iOS/Android
//   don't need transitions (OS handles press animations), but
//   web does.
//   → webTransition() produces the correct CSS property string.
//
// GAP 4 — Focus rings (keyboard accessibility)
//   RN removes all browser outlines by default. Tab navigation
//   through your app becomes invisible.
//   → Focus ring helpers + injectWebBaseline restore them.
//
// GAP 5 — Cursor
//   Every clickable thing shows a text cursor on web. Pointer,
//   grab, not-allowed need to be set manually.
//   → webCursor() helper.
//
// GAP 6 — Font loading
//   expo-font works on web via CSS injection, but web can also
//   use Google Fonts CDN links (faster, no asset hosting).
//   → injectGoogleFonts() injects the correct <link> tags once.
//
// GAP 7 — CSS custom properties (optional)
//   Inject the active theme as CSS vars so non-RN web components
//   (e.g. react-select, date pickers, custom HTML) can consume
//   the same color tokens.
//   → injectThemeCSSVars() writes :root { --dc-primary: #... }
//
// ── Usage ──────────────────────────────────────────────────
// In App.tsx (web entry point only, or wrapped in Platform.OS check):
//   import { injectWebBaseline, injectGoogleFonts } from '@dreamcrafter/theme';
//   injectWebBaseline();
//   injectGoogleFonts();
//
// In ThemeProvider — call injectThemeCSSVars(theme) on theme change.
// ============================================================

import { Platform } from 'react-native';
import { useRef, useCallback, useState } from 'react';
import type { DreamcrafterTheme } from './types';

export const IS_WEB = Platform.OS === 'web';

// ── GAP 1 — Global CSS Baseline ──────────────────────────────
let baselineInjected = false;

/**
 * Call ONCE at app startup on web (wrap in `if (Platform.OS === 'web')`).
 * Injects a minimal CSS reset that:
 * - Sets box-sizing: border-box everywhere
 * - Removes default body margin/padding
 * - Enables antialiased font rendering
 * - Styles scrollbars to match the theme mood (neutral; theme-aware
 *   scrollbars use injectThemeCSSVars instead)
 * - Restores focus outlines for keyboard users (RN Web kills them)
 * - Sets cursor: default on non-interactive elements
 * - Prevents text selection flash on rapid taps
 */
export function injectWebBaseline(): void {
  if (!IS_WEB || baselineInjected || typeof document === 'undefined') return;
  baselineInjected = true;

  const style = document.createElement('style');
  style.setAttribute('data-dc', 'baseline');
  style.textContent = `
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body, #root {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
    }

    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      overflow-x: hidden;
    }

    /* Restore focus rings for keyboard navigation.
       RN Web removes all outlines — this restores them
       ONLY for keyboard users (not mouse clicks). */
    :focus-visible {
      outline: 2px solid var(--dc-border-focus, #4ECDC4);
      outline-offset: 2px;
    }

    /* Remove outline for mouse clicks — keeps it for keyboard */
    :focus:not(:focus-visible) {
      outline: none;
    }

    /* Prevent text cursor on Views/containers */
    [data-focusable="false"] {
      cursor: default;
      user-select: none;
    }

    /* Custom scrollbar — neutral, matches any theme */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: var(--dc-surface-sunken, #F1F5F9);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--dc-border-strong, #CBD5E1);
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--dc-text-disabled, #94A3B8);
    }

    /* Text selection color matches theme */
    ::selection {
      background: var(--dc-primary-light, #C7D4EE);
      color: var(--dc-text-primary, #1E293B);
    }

    /* Prevent mobile-style tap highlight on web */
    * {
      -webkit-tap-highlight-color: transparent;
    }

    /* Smooth scrolling everywhere */
    html {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(style);
}

// ── GAP 6 — Google Fonts Web Loading ────────────────────────
let fontsInjected = false;

/**
 * Injects Google Fonts <link> tags for all Dreamcrafter fonts.
 * Call ONCE at app startup on web.
 *
 * IMPORTANT: On web, you should use this INSTEAD of expo-font's
 * Font.loadAsync(). expo-font works on web but loads fonts slower
 * (base64 inline). The CDN approach uses the browser cache and
 * is faster for users who already visited Google Fonts.
 *
 * On native (iOS/Android), DO NOT call this — use FontLoader
 * (expo-font) from icons-fonts.tsx instead.
 */
export function injectGoogleFonts(): void {
  if (!IS_WEB || fontsInjected || typeof document === 'undefined') return;
  fontsInjected = true;

  // Preconnect to Google Fonts for faster loading
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);

  // Single Google Fonts URL covering all 5 genre font families
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = [
    'https://fonts.googleapis.com/css2?',
    // Educational
    'family=Nunito:wght@400;500;600;700;800',
    '&family=Merriweather:wght@400;700',
    // Gaming
    '&family=Fredoka+One',
    '&family=Inter:wght@400;500;600;700',
    // Kids + India Regional
    '&family=Poppins:wght@400;500;600;700;800',
    // Utility
    '&family=Source+Sans+3:wght@400;600;700',
    // India Regional (Indic scripts)
    '&family=Noto+Sans:wght@400;700',
    // All genres — mono
    '&family=Space+Mono:wght@400;700',
    '&display=swap',
  ].join('');
  document.head.appendChild(fontLink);
}

// ── GAP 7 — Theme as CSS Custom Properties ───────────────────
/**
 * Writes the active theme's color tokens as CSS custom properties
 * on :root. This lets non-RN web components (third-party pickers,
 * HTML elements in WebViews, etc.) consume the same tokens.
 *
 * Call this inside ThemeProvider when theme changes:
 *   useEffect(() => { injectThemeCSSVars(theme); }, [theme]);
 *
 * Properties written:
 *   --dc-primary, --dc-secondary, --dc-accent,
 *   --dc-background, --dc-surface, ...all SemanticColors keys
 *   --dc-radius-md, --dc-spacing-4, etc.
 */
export function injectThemeCSSVars(theme: DreamcrafterTheme): void {
  if (!IS_WEB || typeof document === 'undefined') return;

  const root = document.documentElement;

  // Colors
  const colors = theme.colors;
  root.style.setProperty('--dc-primary',           colors.primary);
  root.style.setProperty('--dc-primary-light',     colors.primaryLight);
  root.style.setProperty('--dc-primary-dark',      colors.primaryDark);
  root.style.setProperty('--dc-secondary',         colors.secondary);
  root.style.setProperty('--dc-secondary-light',   colors.secondaryLight);
  root.style.setProperty('--dc-accent',            colors.accent);
  root.style.setProperty('--dc-background',        colors.background);
  root.style.setProperty('--dc-surface',           colors.surface);
  root.style.setProperty('--dc-surface-raised',    colors.surfaceRaised);
  root.style.setProperty('--dc-surface-sunken',    colors.surfaceSunken);
  root.style.setProperty('--dc-text-primary',      colors.textPrimary);
  root.style.setProperty('--dc-text-secondary',    colors.textSecondary);
  root.style.setProperty('--dc-text-disabled',     colors.textDisabled);
  root.style.setProperty('--dc-text-inverse',      colors.textInverse);
  root.style.setProperty('--dc-text-link',         colors.textLink);
  root.style.setProperty('--dc-border',            colors.border);
  root.style.setProperty('--dc-border-strong',     colors.borderStrong);
  root.style.setProperty('--dc-border-focus',      colors.borderFocus);
  root.style.setProperty('--dc-error',             colors.error);
  root.style.setProperty('--dc-success',           colors.success);
  root.style.setProperty('--dc-warning',           colors.warning);

  // Spacing
  root.style.setProperty('--dc-spacing-1',  `${theme.spacing[1]}px`);
  root.style.setProperty('--dc-spacing-2',  `${theme.spacing[2]}px`);
  root.style.setProperty('--dc-spacing-4',  `${theme.spacing[4]}px`);
  root.style.setProperty('--dc-spacing-6',  `${theme.spacing[6]}px`);
  root.style.setProperty('--dc-spacing-8',  `${theme.spacing[8]}px`);

  // Border radius
  root.style.setProperty('--dc-radius-sm',  `${theme.borderRadius.sm}px`);
  root.style.setProperty('--dc-radius-md',  `${theme.borderRadius.md}px`);
  root.style.setProperty('--dc-radius-lg',  `${theme.borderRadius.lg}px`);
  root.style.setProperty('--dc-radius-full','9999px');

  // Set color-scheme so browser UI (scrollbars, form inputs) matches
  root.style.setProperty('color-scheme', theme.mode === 'dark' ? 'dark' : 'light');
}

// ── GAP 2 — Hover States ─────────────────────────────────────
/**
 * Hook that returns hovered state for web.
 * On native it always returns false — hover doesn't exist there.
 *
 * Usage:
 *   const { hovered, hoverProps } = useHover();
 *   <Pressable {...hoverProps} style={[base, hovered && hoveredStyle]} />
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);

  const hoverProps = IS_WEB ? {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  } : {};

  return { hovered, hoverProps };
}

/**
 * Returns web-only style properties for an interactive element:
 * cursor, transition, and hover background overlay.
 *
 * Usage (inside Pressable style callback):
 *   style={({ pressed }) => [
 *     base,
 *     webInteractiveStyle({ pressed, hovered, primaryColor: theme.colors.primary }),
 *   ]}
 */
export function webInteractiveStyle(opts: {
  pressed: boolean;
  hovered: boolean;
  baseColor?: string;
  hoverOpacity?: number;
  pressOpacity?: number;
  disabled?: boolean;
}): object {
  if (!IS_WEB) return {};

  const {
    pressed, hovered, disabled,
    hoverOpacity = 0.08,
    pressOpacity = 0.15,
  } = opts;

  if (disabled) return { cursor: 'not-allowed' as any };

  const overlayOpacity = pressed ? pressOpacity : hovered ? hoverOpacity : 0;
  const overlayColor = `rgba(255,255,255,${overlayOpacity})`;

  return {
    cursor: 'pointer' as any,
    // CSS transition on background for smooth hover feedback
    transition: 'background-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
    // Lighten the background on hover/press
    ...(overlayOpacity > 0 && {
      backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor})`,
    }),
  };
}

// ── GAP 3 — Transitions ──────────────────────────────────────
/**
 * Returns a CSS transition string for common animatable properties.
 * Returns '' on native (where transitions don't apply).
 *
 * Usage:
 *   style={{ transition: webTransition(['background-color', 'border-color']) }}
 */
export function webTransition(
  properties: string[],
  duration = 150,
  easing = 'ease',
): string {
  if (!IS_WEB) return '';
  return properties
    .map(p => `${p} ${duration}ms ${easing}`)
    .join(', ');
}

// ── GAP 5 — Cursor ───────────────────────────────────────────
/**
 * Returns the correct cursor style for web, nothing on native.
 *
 * Usage:
 *   style={{ ...webCursor('pointer') }}
 */
export function webCursor(cursor: 'pointer' | 'default' | 'text' | 'grab' | 'grabbing' | 'not-allowed' | 'crosshair'): object {
  if (!IS_WEB) return {};
  return { cursor } as any;
}

// ── Web-only style helper ────────────────────────────────────
/**
 * Applies styles only on web. On native, returns empty object.
 * Useful for one-off web overrides without Platform.select verbosity.
 *
 * Usage:
 *   style={[base, webOnly({ userSelect: 'none', outline: 'none' })]}
 */
export function webOnly(style: object): object {
  return IS_WEB ? style : {};
}

// ── Web input focus ring ─────────────────────────────────────
/**
 * Returns a web focus ring style for text inputs.
 * RN Web removes browser outlines — this brings them back in a
 * theme-consistent way when the input is focused.
 *
 * Usage:
 *   <TextInput style={[styles.input, isFocused && webFocusRing(theme.colors.borderFocus)]} />
 */
export function webFocusRing(color: string, width = 2): object {
  if (!IS_WEB) return {};
  return {
    outlineWidth: width,
    outlineStyle: 'solid' as any,
    outlineColor: color,
    outlineOffset: 0,
  } as any;
}

// ── Max-width container ──────────────────────────────────────
/**
 * Web apps on large screens need a max-width to stay readable.
 * Native apps ignore this — it's web-only.
 *
 * Usage:
 *   <View style={[flex1, webMaxWidth(1200)]} />
 */
export function webMaxWidth(maxWidth: number, centered = true): object {
  if (!IS_WEB) return {};
  return {
    maxWidth,
    ...(centered && { marginHorizontal: 'auto' as any }),
    width: '100%' as any,
  };
}
