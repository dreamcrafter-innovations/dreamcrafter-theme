// ============================================================
// DREAMCRAFTER — Platform Utilities
//
// React Native has platform-specific behaviour that the base
// theme system can't paper over. This file provides helpers
// that produce correct cross-platform styles.
//
// KEY ISSUES SOLVED:
// 1. Shadows: iOS uses shadow* props; Android uses elevation
//    and CANNOT render colored shadows — only grey elevation.
//    We split them so each platform gets exactly what works.
// 2. Android font weight: ignored for custom fonts. Must use
//    the correct font FILE per weight (handled by resolveFontFamily
//    already). This file flags and removes the redundant prop.
// 3. Ripple: Android has native ripple; iOS uses opacity.
// 4. Keyboard: behavior prop differs iOS vs Android.
// ============================================================

import { Platform, StyleSheet } from 'react-native';
import type { ShadowValue } from './types';

// ── Platform constants ───────────────────────────────────────
export const IS_IOS     = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_WEB     = Platform.OS === 'web';

// Android API level — useful for feature-gating
export const ANDROID_API = IS_ANDROID ? (Platform.Version as number) : 0;

// ── Shadow splitting ─────────────────────────────────────────
/**
 * Splits a ShadowValue into the correct platform-specific style.
 *
 * iOS:     uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android: uses elevation ONLY — colored shadows are not supported
 * Web:     converts to boxShadow
 *
 * Usage:
 *   <View style={[styles.card, platformShadow(theme.shadows.md)]} />
 */
export function platformShadow(shadow: ShadowValue): object {
  if (IS_WEB) {
    const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = shadow;
    // Parse hex or rgb color for rgba()
    const rgba = hexToRgba(shadowColor, shadowOpacity);
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius * 2}px ${rgba}`,
    };
  }

  if (IS_ANDROID) {
    // Android elevation — colour is always OS-controlled (grey), not customisable
    return { elevation: shadow.elevation };
  }

  // iOS
  return {
    shadowColor:   shadow.shadowColor,
    shadowOffset:  shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius:  shadow.shadowRadius,
  };
}

/**
 * Same as platformShadow but applied as a StyleSheet-compatible object.
 * Use inside StyleSheet.create() calls.
 */
export function shadowStyle(shadow: ShadowValue) {
  return StyleSheet.flatten(platformShadow(shadow) as any);
}

// ── Android font weight fix ──────────────────────────────────
/**
 * On Android, fontWeight is IGNORED when using custom fonts loaded via
 * expo-font. The weight is determined entirely by the font FILE name.
 * resolveFontFamily() already picks the correct file — this helper
 * removes the redundant fontWeight prop on Android to avoid mismatches.
 *
 * Usage:
 *   style={{ fontFamily: resolveFontFamily('Poppins', '700'), ...androidFontWeight('700') }}
 *
 * On iOS/Web: returns { fontWeight: '700' }
 * On Android: returns {}
 */
export function androidFontWeight(weight: string): object {
  if (IS_ANDROID) return {};
  return { fontWeight: weight as any };
}

// ── Ripple / touch feedback ──────────────────────────────────
/**
 * Returns the correct Pressable android_ripple prop or undefined.
 * Centralises ripple colour decisions so all touchables stay consistent.
 *
 * Usage:
 *   <Pressable android_ripple={rippleConfig(theme.colors.ripple)} onPress={...}>
 */
export function rippleConfig(color: string, borderless = false) {
  if (!IS_ANDROID) return undefined;
  return { color, borderless, radius: borderless ? 24 : undefined };
}

// ── Keyboard avoiding view behaviour ────────────────────────
/**
 * KeyboardAvoidingView `behavior` prop differs per platform.
 * iOS needs 'padding', Android works best with 'height' or undefined.
 *
 * Usage:
 *   <KeyboardAvoidingView behavior={keyboardBehavior} style={{ flex: 1 }}>
 */
export const keyboardBehavior = IS_IOS ? 'padding' : 'height';

/**
 * Extra offset for iOS when there's a navigation header.
 * Pass the header height (default 56) to get the right offset.
 */
export function keyboardVerticalOffset(headerHeight = 56): number {
  return IS_IOS ? headerHeight : 0;
}

// ── Status bar style ─────────────────────────────────────────
/**
 * Returns the correct StatusBar barStyle for light/dark mode.
 * iOS: 'light-content' on dark bg, 'dark-content' on light bg
 * Android: same + backgroundColor override recommended
 */
export function statusBarStyle(isDark: boolean): 'light-content' | 'dark-content' {
  return isDark ? 'light-content' : 'dark-content';
}

// ── Hit slop helpers ─────────────────────────────────────────
/**
 * Minimum touch target is 44×44pt (Apple HIG) / 48×48dp (Google MD).
 * Use on small icons/buttons to expand tap area without changing layout.
 */
export const HIT_SLOP_SM = { top: 8, right: 8, bottom: 8, left: 8 };
export const HIT_SLOP_MD = { top: 12, right: 12, bottom: 12, left: 12 };
export const HIT_SLOP_LG = { top: 16, right: 16, bottom: 16, left: 16 };

// ── Internal: hex → rgba ─────────────────────────────────────
function hexToRgba(hex: string, opacity: number): string {
  if (!hex || hex === 'transparent') return `rgba(0,0,0,${opacity})`;
  const clean = hex.replace('#', '');
  if (clean.length < 6) return `rgba(0,0,0,${opacity})`;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
