// ============================================================
// DREAMCRAFTER — Theme Provider & Hook
// Usage:
//   // In app root (App.js):
//   <ThemeProvider genre="gaming" defaultMode="dark">
//     <AppNavigator />
//   </ThemeProvider>
//
//   // In any component:
//   const { theme, mode, toggleMode } = useTheme();
//   <View style={{ backgroundColor: theme.colors.background }} />
// ============================================================

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';

// Lazy web utilities — no-op on native
const _injectCSSVars = Platform.OS === 'web'
  ? (theme: any) => { try { require('./web').injectThemeCSSVars(theme); } catch(_){} }
  : (_: any) => {};
import type { DreamcrafterTheme, GenreKey, ColorMode } from './types';

// ── Theme Registry ───────────────────────────────────────────
import { educationalLight, educationalDark } from './themes/educational';
import { gamingLight, gamingDark } from './themes/gaming';
import { kidsLight, kidsDark } from './themes/kids';
import { utilityLight, utilityDark } from './themes/utility';
import { indiaRegionalLight, indiaRegionalDark } from './themes/indiaRegional';

export const themes: Record<GenreKey, Record<ColorMode, DreamcrafterTheme>> = {
  educational:   { light: educationalLight,   dark: educationalDark },
  gaming:        { light: gamingLight,        dark: gamingDark },
  kids:          { light: kidsLight,          dark: kidsDark },
  utility:       { light: utilityLight,       dark: utilityDark },
  indiaRegional: { light: indiaRegionalLight, dark: indiaRegionalDark },
};

export function getTheme(genre: GenreKey, mode: ColorMode): DreamcrafterTheme {
  return themes[genre][mode];
}

// ── Context ──────────────────────────────────────────────────
interface ThemeContextValue {
  theme: DreamcrafterTheme;
  genre: GenreKey;
  mode: ColorMode;
  isDark: boolean;
  toggleMode: () => void;
  setMode: (mode: ColorMode) => void;
  setGenre: (genre: GenreKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
interface ThemeProviderProps {
  genre: GenreKey;
  /**
   * 'system' — follows device dark/light setting (recommended for most apps)
   * 'light' | 'dark' — force a specific mode
   */
  defaultMode?: ColorMode | 'system';
  children: React.ReactNode;
}

export function ThemeProvider({ genre: initialGenre, defaultMode = 'system', children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [genre, setGenre] = useState<GenreKey>(initialGenre);
  const [overrideMode, setOverrideMode] = useState<ColorMode | null>(
    defaultMode === 'system' ? null : defaultMode
  );

  const resolvedMode: ColorMode = overrideMode ?? (systemColorScheme === 'dark' ? 'dark' : 'light');

  const theme = useMemo(() => getTheme(genre, resolvedMode), [genre, resolvedMode]);

  // On web: write theme as CSS custom properties whenever theme changes
  useEffect(() => { _injectCSSVars(theme); }, [theme]);

  const toggleMode = useCallback(() => {
    setOverrideMode(prev => (prev ?? resolvedMode) === 'light' ? 'dark' : 'light');
  }, [resolvedMode]);

  const setMode = useCallback((mode: ColorMode) => {
    setOverrideMode(mode);
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    genre,
    mode: resolvedMode,
    isDark: resolvedMode === 'dark',
    toggleMode,
    setMode,
    setGenre,
  }), [theme, genre, resolvedMode, toggleMode, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

// ── Convenience: themed StyleSheet ──────────────────────────
// Like StyleSheet.create but with theme access baked in.
// Usage:
//   const styles = makeStyles(({ theme }) => ({
//     container: { backgroundColor: theme.colors.background },
//   }));
//   // In component: const styles = useStyles();
export function makeStyles<T extends Record<string, object>>(
  factory: (args: { theme: DreamcrafterTheme }) => T
) {
  return function useStyles() {
    const { theme } = useTheme();
    return useMemo(() => factory({ theme }), [theme]);
  };
}
