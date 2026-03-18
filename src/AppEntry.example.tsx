// ============================================================
// DREAMCRAFTER — Web Entry Point Pattern
//
// Copy this pattern into each app's App.tsx (or App.web.tsx
// if you want a separate web entry — Expo supports this).
//
// Expo loads App.web.tsx for web and App.tsx for native
// automatically when both exist. This lets you have
// different entry setups without platform checks everywhere.
// ============================================================

import React from 'react';
import { Platform } from 'react-native';

// Web baseline — call before anything renders
// On native these are no-ops, so safe to call unconditionally
import { injectWebBaseline, injectGoogleFonts } from './web';
injectWebBaseline();  // CSS reset, scrollbars, focus rings
injectGoogleFonts();  // Google Fonts CDN links

// Safe area: use SafeAreaProvider from RN safe area context
// On web it's a lightweight no-op wrapper, still required
import { SafeAreaProvider } from 'react-native-safe-area-context';

// FontLoader: on web, skip it — injectGoogleFonts() handles fonts.
// On native, wrap with FontLoader to load font files via expo-font.
import { FontLoader, ThemeProvider } from './ThemeProvider';

// Your navigator
// import AppNavigator from './navigation/AppNavigator';

// ── Conditional font loading ─────────────────────────────────
// Web: fonts come from Google Fonts CDN — no file loading needed
// Native: FontLoader uses expo-font to load .ttf files
const AppWithFonts = Platform.OS === 'web'
  ? ({ children }: { children: React.ReactNode }) => <>{children}</>
  : FontLoader;

export default function App() {
  return (
    <SafeAreaProvider>
      <AppWithFonts>
        {/* genre = the genre for this specific app */}
        {/* defaultMode="system" follows device dark/light setting */}
        <ThemeProvider genre="gaming" defaultMode="system">
          {/* <AppNavigator /> */}
          <></>
        </ThemeProvider>
      </AppWithFonts>
    </SafeAreaProvider>
  );
}

// ── What each wrapper does ───────────────────────────────────
//
// injectWebBaseline()
//   CSS reset: box-sizing, body margin, font-smoothing,
//   scrollbars, focus rings, selection color, tap highlight
//   Web only — no-op on native
//
// injectGoogleFonts()
//   Injects <link> tags for all 5 genre font families via CDN
//   Web only — no-op on native
//
// SafeAreaProvider
//   iOS: provides notch/Dynamic Island inset values
//   Android: provides status bar + nav bar inset values
//   Web: lightweight no-op wrapper (still required by hook)
//
// AppWithFonts / FontLoader
//   Native only: loads .ttf font files via expo-font,
//   keeps splash screen visible until fonts are ready
//   Web: skipped — CDN fonts are loaded by the browser
//
// ThemeProvider
//   All platforms: provides theme context, dark/light mode,
//   and on web auto-injects CSS custom properties on theme change
