// ============================================================
// DREAMCRAFTER — Monorepo Asset Sharing
//
// The problem: Expo's Metro bundler, by default, cannot resolve
// assets (fonts, images) that live OUTSIDE the app's own folder.
// The @dreamcrafter/theme package needs to ship its fonts and
// images once — and every app must be able to use them.
//
// This file explains the full setup.
// ============================================================

// ── REPOSITORY STRUCTURE ────────────────────────────────────
//
// dreamcrafter-innovations/          ← GitHub Organization
// │
// ├── packages/
// │   └── dreamcrafter-theme/        ← @dreamcrafter/theme
// │       ├── src/                   ← all TypeScript source
// │       ├── assets/
// │       │   ├── fonts/             ← .ttf files (shared once)
// │       │   │   ├── Nunito-Regular.ttf
// │       │   │   ├── Nunito-Bold.ttf
// │       │   │   ├── FredokaOne-Regular.ttf
// │       │   │   ├── Inter-Regular.ttf
// │       │   │   ├── Poppins-Regular.ttf
// │       │   │   ├── SourceSansPro-Regular.ttf
// │       │   │   ├── NotoSans-Regular.ttf
// │       │   │   ├── SpaceMono-Regular.ttf
// │       │   │   └── ... (all weights)
// │       │   └── images/            ← shared brand images
// │       │       ├── logo-light.png
// │       │       ├── logo-dark.png
// │       │       └── splash-base.png
// │       └── package.json
// │
// ├── apps/
// │   ├── app-werewolf-mafia/
// │   │   ├── app.json
// │   │   ├── metro.config.js        ← MUST extend base config
// │   │   └── package.json
// │   ├── app-pressure-cooker-timer/
// │   │   ├── metro.config.js
// │   │   └── ...
// │   └── app-[name]/
// │
// ├── package.json                   ← root workspaces config
// └── metro.config.base.js           ← shared Metro config

// ── ROOT PACKAGE.JSON ───────────────────────────────────────
// File: /package.json
const rootPackageJson = {
  "name": "dreamcrafter-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "theme": "cd packages/dreamcrafter-theme && tsc --noEmit",
    "werewolf": "cd apps/app-werewolf-mafia && npx expo start",
    "timer": "cd apps/app-pressure-cooker-timer && npx expo start"
  }
};

// ── SHARED METRO BASE CONFIG ─────────────────────────────────
// File: /metro.config.base.js
//
// This is the key fix. Metro needs to know:
// 1. The monorepo root (to resolve workspace packages)
// 2. That assets inside packages/ are allowed
//
// Every app's metro.config.js extends this.

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * @param {string} appDir - absolute path to the app directory
 * @returns Metro config
 */
function createMetroConfig(appDir) {
  const monorepoRoot = path.resolve(appDir, '../..');
  const config = getDefaultConfig(appDir);

  // Watch the entire monorepo, not just the app folder
  config.watchFolders = [monorepoRoot];

  // Allow Metro to resolve modules from the monorepo root node_modules
  // AND from each app's own node_modules (for app-specific deps)
  config.resolver.nodeModulesPaths = [
    path.resolve(appDir, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ];

  // THIS IS THE CRITICAL FIX:
  // By default Metro blocks asset resolution outside the project root.
  // assetExts tells Metro which file extensions are assets.
  // But the real fix is watchFolders above — Metro will now
  // find assets in packages/dreamcrafter-theme/assets/ correctly.

  return config;
}

module.exports = { createMetroConfig };

// ── PER-APP METRO CONFIG ─────────────────────────────────────
// File: /apps/app-werewolf-mafia/metro.config.js
// Copy this into EVERY app — just change the __dirname reference.

const { createMetroConfig: _createMetroConfig } = require('../../metro.config.base');
module.exports = _createMetroConfig(__dirname);

// ── APP.JSON — FONT PRELOADING ───────────────────────────────
// File: /apps/app-werewolf-mafia/app.json
//
// Expo can preload fonts at the native level (iOS/Android) so
// the splash screen holds until fonts are ready WITHOUT needing
// FontLoader at all. This is the smoothest approach.
// On web, injectGoogleFonts() handles it instead.

const appJson = {
  "expo": {
    "name": "Werewolf & Mafia",
    "slug": "app-werewolf-mafia",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "fonts": [
      // Paths are relative to the app folder.
      // Metro resolves these through the monorepo watchFolders.
      "../../packages/dreamcrafter-theme/assets/fonts/FredokaOne-Regular.ttf",
      "../../packages/dreamcrafter-theme/assets/fonts/Inter-Regular.ttf",
      "../../packages/dreamcrafter-theme/assets/fonts/Inter-Medium.ttf",
      "../../packages/dreamcrafter-theme/assets/fonts/Inter-SemiBold.ttf",
      "../../packages/dreamcrafter-theme/assets/fonts/Inter-Bold.ttf",
      "../../packages/dreamcrafter-theme/assets/fonts/SpaceMono-Regular.ttf"
      // Only include the fonts for THIS app's genre (gaming).
      // Don't list all 30+ font files in every app — it bloats the bundle.
    ],
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    }
  }
};

// ── FONT STRATEGY PER PLATFORM ───────────────────────────────
//
// Platform     │ Strategy                          │ Why
// ─────────────┼───────────────────────────────────┼────────────────────
// iOS/Android  │ app.json "fonts" array            │ Preloads before app
//              │ OR FontLoader (expo-font)          │ splash hides
// Web          │ injectGoogleFonts() CDN            │ Browser cache,
//              │ (no file loading needed)           │ faster first load
//
// You only need ONE of the native strategies.
// app.json is simpler. FontLoader gives you a loading state to show UI.

// ── WHAT EACH APP IMPORTS ────────────────────────────────────
// File: /apps/app-werewolf-mafia/App.tsx

import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  injectWebBaseline,
  injectGoogleFonts,
} from '@dreamcrafter/theme';

// Web-only setup (no-op on native)
injectWebBaseline();
injectGoogleFonts();

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Each app sets its own genre — that's the ONLY thing that differs */}
      <ThemeProvider genre="gaming" defaultMode="system">
        {/* your navigator */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// ── WHAT CHANGES PER APP ─────────────────────────────────────
//
// App                          │ genre prop      │ Fonts to list in app.json
// ─────────────────────────────┼─────────────────┼───────────────────────────
// Werewolf, Imposter, Charades │ "gaming"        │ FredokaOne, Inter
// Debate, IvyLeaguePrep        │ "educational"   │ Nunito, Merriweather
// StoryBuilder, MyFirstJournal │ "kids"          │ Poppins
// PressureCookerTimer, Pooja   │ "indiaRegional" │ Poppins, NotoSans
// SchoolTimetable, ChoreTracker│ "utility"       │ Inter, SourceSansPro
//
// THAT IS LITERALLY IT. One line changes between apps.
// All colors, spacing, shadows, components — auto from ThemeProvider.

// ── CANVA BRAND ASSETS ───────────────────────────────────────
//
// Canva exports (thumbnails, icons, store screenshots, logos) are
// NOT bundled with apps. They live in GitHub separately:
//
// brand/                           ← public GitHub repo
// ├── logos/
// │   ├── dreamcrafter-light.svg
// │   ├── dreamcrafter-dark.svg
// │   ├── dreamcrafter-light.png   ← 1x, 2x, 3x
// │   └── dreamcrafter-dark.png
// ├── themes/
// │   ├── educational.json         ← hex codes for Canva Brand Kit
// │   ├── gaming.json
// │   ├── kids.json
// │   ├── utility.json
// │   └── indiaRegional.json
// ├── app-icons/                   ← per-app icons from Canva
// │   ├── werewolf-icon.png
// │   ├── timer-icon.png
// │   └── ...
// ├── store-screenshots/           ← Play Store / App Store screenshots
// │   ├── werewolf/
// │   │   ├── phone-1.png
// │   │   └── tablet-1.png
// │   └── timer/
// └── thumbnails/                  ← YouTube thumbnails
//     └── educational/
//         └── ...

// ── THEME JSON FOR CANVA ─────────────────────────────────────
// File: /brand/themes/gaming.json
//
// Export this from your theme code to keep Canva Brand Kit
// in sync with the code. When you update a color in code,
// update this file too, then re-import into Canva Brand Kit.

const gamingThemeForCanva = {
  "name": "Gaming & Apps",
  "primary": "#6C3FE8",
  "secondary": "#39FF14",
  "accent": "#FF6B6B",
  "background": "#FAFAFA",
  "backgroundDark": "#0D0522",
  "text": "#1A1230",
  "textDark": "#F0EAFF",
  "fonts": {
    "heading": "Fredoka One",
    "body": "Inter"
  }
};

// ── PER-APP ASSETS (inside each app folder) ──────────────────
//
// apps/app-werewolf-mafia/
// └── assets/
//     ├── icon.png           ← 1024x1024, your Canva-made app icon
//     ├── splash.png         ← 1284x2778 for iPhone 14 Pro Max
//     ├── adaptive-icon.png  ← Android adaptive icon foreground
//     └── favicon.png        ← Web favicon (32x32)
//
// These are PER APP. Do not share them via the theme package.
// Each app has its own icon and splash.

// ── IN-APP IMAGES (game assets, illustrations) ───────────────
//
// Images used inside the app UI (role cards, character art,
// background scenes) live inside the app itself:
//
// apps/app-werewolf-mafia/
// └── assets/
//     └── images/
//         ├── role-werewolf.png
//         ├── role-villager.png
//         ├── role-seer.png
//         └── background-night.png
//
// These are bundled with the app. For Daughter/character avatars
// used across multiple apps, put them in:
// packages/dreamcrafter-theme/assets/images/avatars/
// and reference via the theme package.

export {};
