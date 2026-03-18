// ============================================================
// DREAMCRAFTER — Icon & Font System
//
// Icons: Uses @expo/vector-icons (MaterialCommunityIcons)
//        — free, ships with Expo, 7000+ icons, no extra install
//
// Fonts: Uses expo-font for loading custom fonts
//
// ── How to add to a new app ──────────────────────────────────
//   1. Install: expo install @expo/vector-icons expo-font
//   2. Wrap app root with <FontLoader> (see below)
//   3. Use <DcIcon name="home" genre="educational" /> anywhere
//   4. Use typography tokens for text styles
// ============================================================

// ── ICON SYSTEM ─────────────────────────────────────────────
// We use MaterialCommunityIcons throughout for consistency.
// Genre-specific icon sets map semantic names → icon strings.
// This means swapping the icon for an entire genre is one line.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import type { GenreKey } from './types';
import { useTheme } from './ThemeProvider';

// Semantic icon names used across all apps
export type IconName =
  // Navigation
  | 'home' | 'back' | 'forward' | 'close' | 'menu' | 'settings'
  // Actions
  | 'play' | 'pause' | 'stop' | 'restart' | 'share' | 'edit' | 'delete' | 'add' | 'check'
  // Content
  | 'star' | 'heart' | 'bookmark' | 'trophy' | 'fire' | 'lightning' | 'sparkle'
  // Status
  | 'info' | 'warning' | 'error' | 'success' | 'lock' | 'unlock'
  // People
  | 'person' | 'family' | 'child' | 'group'
  // Educational
  | 'book' | 'pencil' | 'calculator' | 'science' | 'lightbulb' | 'graduation'
  // Game
  | 'dice' | 'controller' | 'timer' | 'puzzle' | 'cards'
  // Utility
  | 'clock' | 'calendar' | 'bell' | 'phone' | 'list' | 'chart'
  // India Regional
  | 'temple' | 'food' | 'music' | 'festival';

// Map semantic → MaterialCommunityIcons name, per genre
// Override per genre if the icon style should differ
const iconMap: Record<IconName, string> = {
  home:        'home',
  back:        'arrow-left',
  forward:     'arrow-right',
  close:       'close',
  menu:        'menu',
  settings:    'cog',
  play:        'play-circle',
  pause:       'pause-circle',
  stop:        'stop-circle',
  restart:     'restart',
  share:       'share-variant',
  edit:        'pencil',
  delete:      'trash-can',
  add:         'plus-circle',
  check:       'check-circle',
  star:        'star',
  heart:       'heart',
  bookmark:    'bookmark',
  trophy:      'trophy',
  fire:        'fire',
  lightning:   'lightning-bolt',
  sparkle:     'star-four-points',
  info:        'information',
  warning:     'alert',
  error:       'alert-circle',
  success:     'check-circle',
  lock:        'lock',
  unlock:      'lock-open',
  person:      'account',
  family:      'account-multiple',
  child:       'account-child',
  group:       'account-group',
  book:        'book-open-variant',
  pencil:      'lead-pencil',
  calculator:  'calculator',
  science:     'flask',
  lightbulb:   'lightbulb',
  graduation:  'school',
  dice:        'dice-multiple',
  controller:  'controller-classic',
  timer:       'timer',
  puzzle:      'puzzle',
  cards:       'cards',
  clock:       'clock-outline',
  calendar:    'calendar',
  bell:        'bell',
  phone:       'phone',
  list:        'format-list-bulleted',
  chart:       'chart-bar',
  temple:      'temple-hindu',
  food:        'food',
  music:       'music',
  festival:    'party-popper',
};

// Genre-specific icon overrides (when a different icon fits better)
const genreIconOverrides: Partial<Record<GenreKey, Partial<Record<IconName, string>>>> = {
  gaming: {
    star:      'star-shooting',
    heart:     'heart-flash',
    lightning: 'lightning-bolt-circle',
    home:      'controller-classic',
  },
  kids: {
    star:    'star-face',
    heart:   'heart-circle',
    sparkle: 'shimmer',
    book:    'book-heart',
  },
  educational: {
    star:   'star-circle',
    book:   'book-education',
    pencil: 'pen',
  },
};

export function getIconName(semantic: IconName, genre: GenreKey): string {
  return genreIconOverrides[genre]?.[semantic] ?? iconMap[semantic];
}

// ── DcIcon Component ─────────────────────────────────────────
interface DcIconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;             // defaults to theme.colors.textPrimary
  colorToken?: keyof import('./types').SemanticColors;
  style?: object;
}

export function DcIcon({ name, size = 'md', color, colorToken, style }: DcIconProps) {
  const { theme } = useTheme();
  const iconSize = theme.components.icon[size];
  const resolvedColor = color ?? (colorToken ? theme.colors[colorToken] : theme.colors.textPrimary);
  const iconName = getIconName(name, theme.genre) as any;

  return (
    <MaterialCommunityIcons
      name={iconName}
      size={iconSize}
      color={resolvedColor}
      style={style}
    />
  );
}

// ── FONT SYSTEM ──────────────────────────────────────────────
// The theme package specifies font NAME STRINGS only — not font files.
// Each app loads fonts for its own genre using @expo-google-fonts packages.
//
// Why: bundling font files in the theme package would mean every app
// downloads ALL genre fonts even if it only uses one genre.
//
// Per-genre setup (run in each app, only the fonts you need):
//
//   indiaRegional:  npm install @expo-google-fonts/poppins
//   gaming:         npm install @expo-google-fonts/fredoka-one @expo-google-fonts/inter
//   educational:    npm install @expo-google-fonts/nunito @expo-google-fonts/merriweather
//   kids:           npm install @expo-google-fonts/poppins
//   utility:        npm install @expo-google-fonts/inter @expo-google-fonts/source-sans-3
//
// Then in App.tsx use FontLoader and pass your loaded fonts:
//   import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
//   <FontLoader fonts={{ Poppins_400Regular, Poppins_700Bold }}>

// Font family name constants — used by resolveFontFamily() and DcText
export const FONT_FAMILIES = {
  educational:   { heading: 'Nunito',      body: 'Merriweather',  mono: 'SpaceMono' },
  gaming:        { heading: 'FredokaOne',  body: 'Inter',         mono: 'SpaceMono' },
  kids:          { heading: 'Poppins',     body: 'Poppins',       mono: 'SpaceMono' },
  utility:       { heading: 'Inter',       body: 'SourceSansPro', mono: 'SpaceMono' },
  indiaRegional: { heading: 'Poppins',     body: 'Poppins',       mono: 'SpaceMono', regional: 'NotoSans' },
} as const;

// Font name → weight mapping for Text style
// Usage: fontFamily: resolveFontFamily('Poppins', '600')
export function resolveFontFamily(baseFont: string, weight: string): string {
  const weightMap: Record<string, string> = {
    '400': 'Regular',
    '500': 'Medium',
    '600': 'SemiBold',
    '700': 'Bold',
    '800': 'ExtraBold',
  };
  const suffix = weightMap[weight] ?? 'Regular';

  // FredokaOne doesn't have weight variants
  if (baseFont === 'Fredoka One' || baseFont === 'FredokaOne') {
    return 'FredokaOne-Regular';
  }
  // Merriweather only has Regular + Bold
  if (baseFont === 'Merriweather') {
    return weight >= '600' ? 'Merriweather-Bold' : 'Merriweather-Regular';
  }

  const fontKey = baseFont.replace(/\s/g, '');
  return `${fontKey}-${suffix}`;
}

// ── FontLoader Component ─────────────────────────────────────
// Wrap your app root with this ONCE.
// Usage:
//   export default function App() {
//     return (
//       <FontLoader>
//         <ThemeProvider genre="educational">
//           <AppNavigator />
//         </ThemeProvider>
//       </FontLoader>
//     );
//   }

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

interface FontLoaderProps {
  children: React.ReactNode;
  // Pass only the fonts your app's genre needs.
  // e.g. from @expo-google-fonts/poppins:
  //   { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold }
  fonts: Record<string, Font.FontSource>;
  fallback?: React.ReactNode;
}

export function FontLoader({ children, fonts, fallback = null }: FontLoaderProps) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    Font.loadAsync(fonts)
      .catch(console.warn)
      .finally(() => {
        setLoaded(true);
        SplashScreen.hideAsync();
      });
  }, []);

  if (!loaded) return <>{fallback}</>;
  return <>{children}</>;
}
