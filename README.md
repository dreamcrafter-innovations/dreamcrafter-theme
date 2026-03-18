# @dreamcrafter/theme

**Dreamcrafter Innovations LLC — Shared Design System**

One package, five genre themes, light + dark mode, all apps.

---

## Architecture

```
packages/
  dreamcrafter-theme/
    src/
      types.ts              ← TypeScript interfaces for the entire system
      tokens.ts             ← Shared tokens (spacing, fonts, animation, z-index)
      ThemeProvider.tsx     ← React context + useTheme hook + makeStyles
      icons-fonts.tsx       ← DcIcon component + FontLoader + icon mapping
      themes/
        educational.ts      ← Deep Blue + Gold (Nunito + Merriweather)
        gaming.ts           ← Purple + Neon Green (Fredoka One + Inter)
        kids.ts             ← Coral + Teal (Poppins, rounded)
        utility.ts          ← Slate + Teal (Inter + Source Sans, sharp)
        indiaRegional.ts    ← Saffron + Marigold (Poppins + Noto Sans)
      components/
        primitives.tsx      ← DcText, DcView, DcButton, DcInput, DcBadge
      index.ts              ← Single public export
```

---

## Monorepo Setup

In your root `package.json` workspaces:

```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

In each app's `package.json`:

```json
{
  "dependencies": {
    "@dreamcrafter/theme": "*"
  }
}
```

---

## Step 1 — Wrap App Root

```tsx
// apps/app-werewolf/App.tsx
import {
  SafeAreaProvider,
  FontLoader,
  ThemeProvider,
} from '@dreamcrafter/theme';

export default function App() {
  return (
    // SafeAreaProvider MUST be the outermost wrapper — handles
    // iOS notch/Dynamic Island and Android nav bar cutouts
    <SafeAreaProvider>
      <FontLoader>
        <ThemeProvider genre="gaming" defaultMode="system">
          <AppNavigator />
        </ThemeProvider>
      </FontLoader>
    </SafeAreaProvider>
  );
}
```

## Step 2 — Use DcScreen on every screen

```tsx
import { DcScreen, DcText } from '@dreamcrafter/theme';

// Replaces: <SafeAreaView> + <StatusBar> + padding logic
function HomeScreen() {
  return (
    <DcScreen edges={['top', 'bottom']}>
      <DcText variant="h1">Hello!</DcText>
    </DcScreen>
  );
}

// Form screen — keyboard avoidance built in
function LoginScreen() {
  return (
    <DcScreen edges={['top']} keyboardAvoiding>
      <DcInput label="Email" keyboardType="email-address" />
      <DcInput label="Password" secureTextEntry />
    </DcScreen>
  );
}

// Scrollable content
function SettingsScreen() {
  return (
    <DcScrollScreen edges={['top']}>
      <DcText variant="h2">Settings</DcText>
      {/* long content */}
    </DcScrollScreen>
  );
}
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `genre` | GenreKey | required | `'educational' \| 'gaming' \| 'kids' \| 'utility' \| 'indiaRegional'` |
| `defaultMode` | `'system' \| 'light' \| 'dark'` | `'system'` | `'system'` follows device setting |

---

## Step 2 — Use the Theme

### In any component

```tsx
import { useTheme } from '@dreamcrafter/theme';

function MyCard() {
  const { theme, isDark, toggleMode } = useTheme();

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      borderRadius: theme.components.card.borderRadius,
      padding: theme.spacing[4],
      ...theme.shadows.md,
    }}>
      <Text style={{ color: theme.colors.textPrimary }}>Hello!</Text>
    </View>
  );
}
```

### With makeStyles (recommended for complex components)

```tsx
import { makeStyles, DcText } from '@dreamcrafter/theme';

const useStyles = makeStyles(({ theme }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing[4],
  },
  title: {
    color: theme.colors.primary,
    marginBottom: theme.spacing[2],
  },
}));

function MyScreen() {
  const styles = useStyles(); // re-memoizes on theme change only
  return (
    <View style={styles.container}>
      <DcText variant="h2" style={styles.title}>Welcome</DcText>
    </View>
  );
}
```

---

## Pre-Built Primitive Components

### DcText

```tsx
import { DcText } from '@dreamcrafter/theme';

<DcText variant="h1">Title</DcText>
<DcText variant="body" color="textSecondary">Subtitle</DcText>
<DcText variant="caption" align="center">Small note</DcText>
```

Variants: `h1 | h2 | h3 | h4 | body | bodySmall | caption | label | mono`

Headings use the genre's heading font (Nunito, Fredoka One, Poppins, Inter).
Body uses the genre's body font (Merriweather, Inter, Poppins, Source Sans).

### DcView

```tsx
<DcView bg="surface" card>        {/* auto card style */}
<DcView bg="surfaceSunken" raised> {/* elevated */}
```

### DcButton

```tsx
<DcButton label="Start Game" onPress={handleStart} variant="primary" size="lg" />
<DcButton label="Rules" onPress={handleRules} variant="outline" size="md" />
<DcButton label="Quit" onPress={handleQuit} variant="ghost" size="sm" loading={saving} />
```

Variants: `primary | secondary | outline | ghost | danger`

### DcInput

```tsx
<DcInput
  label="Player Name"
  placeholder="Enter name..."
  error={nameError}
  hint="Max 20 characters"
  leftIcon={<DcIcon name="person" size="sm" />}
/>
```

### DcBadge

```tsx
<DcBadge label="NEW" variant="primary" />
<DcBadge label="SALE" variant="error" />
<DcBadge label="✓ Done" variant="success" />
```

### DcIcon

```tsx
import { DcIcon } from '@dreamcrafter/theme';

<DcIcon name="trophy" size="lg" colorToken="secondary" />
<DcIcon name="home" size="md" color="#FF0000" />
```

Icons auto-adapt per genre (e.g., `star` → `star-shooting` in gaming theme).

---

## Genre Reference

| Genre | Primary | Secondary | Accent | Heading Font | Body Font | Radius Style |
|-------|---------|-----------|--------|--------------|-----------|-------------|
| `educational` | `#1B3A6B` Deep Blue | `#F0A500` Gold | `#4ECDC4` Teal | Nunito | Merriweather | Moderate |
| `gaming` | `#6C3FE8` Purple | `#39FF14` Neon | `#FF6B6B` Red | Fredoka One | Inter | Rounded |
| `kids` | `#FF6B6B` Coral | `#4ECDC4` Teal | `#FFE66D` Yellow | Poppins | Poppins | Very Rounded |
| `utility` | `#2D3748` Slate | `#319795` Teal | `#F0A500` Gold | Inter | Source Sans | Sharp |
| `indiaRegional` | `#FF6B35` Saffron | `#FCBF49` Marigold | `#2EC4B6` Teal | Poppins | Poppins + Noto | Moderate |

---

## What's Shared (Never Varies Between Genres)

These tokens are identical across all 5 genres and both modes:

- **Spacing scale** — 4px grid: `spacing[1]=4, spacing[2]=8, spacing[4]=16...`
- **Font sizes** — `xs=11, sm=13, md=15, lg=17, xl=20, 2xl=24, 3xl=30, 4xl=36, 5xl=48`
- **Font weights** — `regular=400, medium=500, semiBold=600, bold=700, extraBold=800`
- **State colors** — `error=#E53E3E, success=#38A169, warning=#D69E2E, info=#3182CE`
- **Z-index** — `base=0, raised=10, dropdown=100, modal=400, toast=500`
- **Breakpoints** — `phone=0, tablet=768, desktop=1024`
- **Animation durations** — `fast=150ms, normal=250ms, slow=400ms`

---

## What Varies Per Genre

- Primary / secondary / accent colors (and all light/dark variants)
- Background, surface, and text colors per mode
- Heading + body font families
- Border radius style (sharp → very rounded)
- Shadow color tinting (matches genre primary)
- Component token sizes (kids gets larger touch targets)
- Animation easing (gaming/kids = spring, utility = smooth)

---

## Adding a New Genre

1. Create `src/themes/myGenre.ts` — follow same structure as existing files
2. Add `MyGenreLight` and `MyGenreDark` exports
3. Add `'myGenre'` to `GenreKey` union in `types.ts`
4. Register in `themes` registry in `ThemeProvider.tsx`
5. Add icon overrides in `icons-fonts.tsx` if needed

---

## Common Patterns

### Responsive padding (phone vs tablet)

```tsx
import { useTheme } from '@dreamcrafter/theme';
import { useWindowDimensions } from 'react-native';

const { theme } = useTheme();
const { width } = useWindowDimensions();
const isTablet = width >= theme.breakpoints.tablet;
const padding = isTablet ? theme.spacing[8] : theme.spacing[4];
```

### Dark mode toggle button

```tsx
const { isDark, toggleMode, theme } = useTheme();
<DcButton
  label={isDark ? '☀️ Light' : '🌙 Dark'}
  onPress={toggleMode}
  variant="ghost"
/>
```

### Conditional color from theme

```tsx
const { theme } = useTheme();
// Use a color token string directly
const badgeColor = isActive ? theme.colors.success : theme.colors.textDisabled;
```

---

## Font Files Needed

Download from Google Fonts (free, OFL license) and place in `packages/dreamcrafter-theme/assets/fonts/`:

| File | Font | Genre |
|------|------|-------|
| `Nunito-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` | Nunito | Educational |
| `Merriweather-{Regular,Bold}.ttf` | Merriweather | Educational |
| `FredokaOne-Regular.ttf` | Fredoka One | Gaming |
| `Inter-{Regular,Medium,SemiBold,Bold}.ttf` | Inter | Gaming + Utility |
| `Poppins-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` | Poppins | Kids + India |
| `SourceSansPro-{Regular,SemiBold,Bold}.ttf` | Source Sans Pro | Utility |
| `NotoSans-{Regular,Bold}.ttf` | Noto Sans | India Regional |
| `SpaceMono-Regular.ttf` | Space Mono | All (mono) |

---

## App–Genre Mapping

| App | Genre to Use |
|-----|-------------|
| Werewolf/Mafia | `gaming` |
| Imposter Game | `gaming` |
| Dumb Charades | `gaming` |
| Pictionary | `gaming` |
| Two Truths One Lie | `gaming` |
| Family Trivia Night | `gaming` |
| Debate App for Kids | `educational` |
| Ivy League Prep | `educational` |
| Times Tables Hero | `educational` |
| Fraction Frenzy | `educational` |
| Science Fair Coach | `educational` |
| Coding for Kids | `educational` |
| Pressure Cooker Timer | `indiaRegional` |
| Pooja Reminder | `indiaRegional` |
| School Timetable+ | `utility` |
| Family Chore Tracker | `utility` |
| Emergency Contacts Kids | `utility` |
| Story Builder AI | `kids` |
| My First Journal | `kids` |
| Spelling Bee Jr. | `indiaRegional` |
| Family Trivia Night (India) | `indiaRegional` |

---

## Cross-Platform Reference

### What works everywhere automatically
- `DcScreen` / `DcScrollScreen` — handles safe area on iOS + Android
- `DcButton` — uses `Pressable` with Android native ripple, iOS opacity press
- `DcText` — `maxFontSizeMultiplier={1.4}` caps accessibility font scaling
- Shadows — `platformShadow()` sends `shadow*` props to iOS, `elevation` to Android, `boxShadow` to web
- Font weights — `androidFontWeight()` removes the prop on Android (custom fonts must use separate files per weight, which `resolveFontFamily()` already handles)

### Known platform differences you can't fully hide

| Issue | iOS | Android | Web |
|-------|-----|---------|-----|
| Colored shadows | ✅ Works (genre-tinted) | ❌ Only grey elevation | ✅ boxShadow |
| Custom font weights | ✅ fontWeight prop | ⚠️ Font FILE determines weight | ✅ fontWeight prop |
| Ripple on press | ❌ Opacity fallback | ✅ Native ripple | ❌ CSS :hover |
| Status bar color | Translucent | Can set bg color | N/A |
| Bottom safe area | Home indicator pad | Nav bar pad | N/A |
| Keyboard behavior | `'padding'` | `'height'` | N/A |

### Tablet layout

```tsx
import { useResponsive } from '@dreamcrafter/theme';

function AppGrid() {
  const { columns, responsive, componentTokens } = useResponsive();

  return (
    <FlatList
      numColumns={columns(2, 3, 4)}         // phone/tablet/desktop
      contentContainerStyle={{
        padding: responsive({ phone: 16, tablet: 24, desktop: 40 }),
        gap: responsive({ phone: 12, tablet: 20 }),
      }}
      // Tablet gets larger card/button sizes automatically:
      // componentTokens.card.padding → 24 on tablet vs 16 on phone
      renderItem={({ item }) => (
        <View style={{ padding: componentTokens.card.padding }}>
          <DcText variant="h3">{item.title}</DcText>
        </View>
      )}
    />
  );
}
```

### Required packages

```bash
expo install \
  react-native-safe-area-context \
  @expo/vector-icons \
  expo-font \
  expo-splash-screen
```
