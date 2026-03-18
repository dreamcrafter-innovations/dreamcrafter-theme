# Animation Web Compatibility — Migration Guide

Fixes for the three animation issues that break on web in game apps
like Werewolf. Find the pattern in your code and swap it out.

---

## Fix 1 — `useNativeDriver: true` crash

### Before (crashes on web)
```tsx
// ❌ This throws on web:
// "useNativeDriver is not supported because the native animated
//  module is missing. Use useNativeDriver: false"
Animated.spring(scaleAnim, {
  toValue: 0.95,
  useNativeDriver: true,   // ← crashes on web
}).start();

Animated.timing(opacityAnim, {
  toValue: 0,
  duration: 200,
  useNativeDriver: true,   // ← crashes on web
}).start();
```

### After (works on all platforms)
```tsx
import { animConfig } from '@dreamcrafter/theme';

// ✅ animConfig() auto-sets useNativeDriver: true on iOS/Android,
//    false on web. Everything else passes through unchanged.
Animated.spring(scaleAnim, animConfig({
  toValue: 0.95,
})).start();

Animated.timing(opacityAnim, animConfig({
  toValue: 0,
  duration: 200,
  easing: Easing.out(Easing.ease),
})).start();
```

**Search your codebase for:** `useNativeDriver: true` — replace every instance with `animConfig({...your config})`.

---

## Fix 2 — `LayoutAnimation` silent failure on web

### Before (does nothing on web)
```tsx
// ❌ On web: no animation, no error. Votes just snap.
import { LayoutAnimation } from 'react-native';

function handleVote(playerId: string) {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  setVotes(prev => ({ ...prev, [playerId]: prev[playerId] + 1 }));
}

// ❌ Also broken — player joining lobby doesn't animate on web
function handlePlayerJoin(player: Player) {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setPlayers(prev => [...prev, player]);
}
```

### After (works on all platforms)
```tsx
import { animateLayout } from '@dreamcrafter/theme';

function handleVote(playerId: string) {
  animateLayout('spring');  // spring on iOS/Android, no-op on web
  setVotes(prev => ({ ...prev, [playerId]: prev[playerId] + 1 }));
}

function handlePlayerJoin(player: Player) {
  animateLayout('ease');
  setPlayers(prev => [...prev, player]);
}
```

**Also add to App.tsx** (Android requires explicit opt-in):
```tsx
import { enableAndroidLayoutAnimation } from '@dreamcrafter/theme';
enableAndroidLayoutAnimation(); // call once before any render
```

---

## Fix 3 — Card press animation lag on web

### Before (feels laggy on web rapid taps)
```tsx
// ❌ Animated.spring with useNativeDriver: true works great
//    on native but is JS-thread-bound on web, causing
//    visible lag when players tap cards quickly (voting).
const scaleAnim = useRef(new Animated.Value(1)).current;

<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  <Pressable
    onPressIn={() => {
      Animated.spring(scaleAnim, {
        toValue: 0.93,
        useNativeDriver: true,  // crash on web
      }).start();
    }}
    onPressOut={() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,  // crash on web
      }).start();
    }}
  >
    <RoleCard />
  </Pressable>
</Animated.View>
```

### After (CSS on web, Animated on native)
```tsx
import { usePressScale } from '@dreamcrafter/theme';

// ✅ On web: CSS transform (GPU-accelerated, zero JS cost)
//    On native: Animated.spring on UI thread (same as before)
const { pressProps, animatedStyle } = usePressScale({ scale: 0.93 });

<Animated.View style={animatedStyle}>
  <Pressable {...pressProps} onPress={handleReveal}>
    <RoleCard />
  </Pressable>
</Animated.View>
```

---

## Werewolf Role Reveal Card — Full Example

The role reveal is the centrepiece of Werewolf — face-down card
flips to show Villager, Werewolf, Seer, etc. Here's the full
cross-platform implementation:

```tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated'; // or react-native
import {
  useCardFlip, usePressScale,
  useTheme, DcText, platformShadow,
} from '@dreamcrafter/theme';

interface RoleCardProps {
  role: string;
  playerName: string;
  onReveal?: () => void;
}

export function WerewolfRoleCard({ role, playerName, onReveal }: RoleCardProps) {
  const { theme } = useTheme();
  const { frontStyle, backStyle, containerStyle, flip, isFlipped } = useCardFlip({
    duration: 500,
    onFlipped: onReveal,
  });
  const { pressProps, animatedStyle } = usePressScale({ scale: 0.96 });

  const roleColor = {
    Werewolf:  theme.colors.error,
    Villager:  theme.colors.success,
    Seer:      theme.colors.info,
    Doctor:    theme.colors.secondary,
  }[role] ?? theme.colors.textSecondary;

  return (
    // Outer press scale wrapper
    <Animated.View style={animatedStyle}>
      <Pressable {...pressProps} onPress={flip}>
        {/* 
          containerStyle sets perspective: 1000 on web (CSS property).
          On native, add transform: [{perspective: 1000}] to cardContainer.
        */}
        <View style={[styles.cardContainer, containerStyle]}>

          {/* Front face — face down, shows '?' */}
          <Animated.View style={[styles.card, frontStyle, {
            backgroundColor: theme.colors.primary,
            ...platformShadow(theme.shadows.lg),
          }]}>
            <DcText variant="h1" color="textInverse" align="center">?</DcText>
            <DcText variant="label" color="textInverse" align="center">
              {playerName}
            </DcText>
            <DcText variant="caption" color="textInverse" align="center">
              Tap to reveal
            </DcText>
          </Animated.View>

          {/* Back face — role reveal */}
          <Animated.View style={[styles.card, backStyle, {
            backgroundColor: theme.colors.surface,
            borderColor: roleColor,
            borderWidth: 2,
            ...platformShadow(theme.shadows.lg),
          }]}>
            <DcText variant="h3" align="center" style={{ color: roleColor }}>
              {role}
            </DcText>
            <DcText variant="body" color="textSecondary" align="center">
              {playerName}
            </DcText>
          </Animated.View>

        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    height: 220,
    // On native: add perspective here for card flip to work
    // transform: [{ perspective: 1000 }]
    // On web: containerStyle from useCardFlip handles it
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
});
```

---

## Player Lobby Stagger — Full Example

Players joining the lobby should slide in one by one, not all pop in at once.

```tsx
import { useStaggeredEntrance, animateLayout, DcText } from '@dreamcrafter/theme';
import Animated from 'react-native'; // Animated from RN

function PlayerLobby({ players }: { players: Player[] }) {
  const getItemStyle = useStaggeredEntrance(players.length, {
    staggerMs: 80,
    duration: 350,
    fromY: 24,
  });

  // When a new player joins mid-game:
  const addPlayer = (player: Player) => {
    animateLayout('spring');       // reshuffles existing layout smoothly
    setPlayers(p => [...p, player]);
    // Note: useStaggeredEntrance only runs on mount, so new players
    // will just appear (not slide in). For dynamic adds, use useFadeIn
    // on each PlayerCard separately.
  };

  return (
    <View style={{ gap: 12 }}>
      {players.map((player, i) => (
        <Animated.View key={player.id} style={getItemStyle(i)}>
          <PlayerCard player={player} />
        </Animated.View>
      ))}
    </View>
  );
}
```

---

## Quick Reference

| Pattern | iOS/Android | Web | Fix |
|---------|------------|-----|-----|
| `useNativeDriver: true` | ✅ | ❌ crash | `animConfig({...})` |
| `LayoutAnimation` | ✅ | ❌ silent | `animateLayout()` |
| Animated press scale | ✅ smooth | ⚠️ laggy | `usePressScale()` |
| Card flip | ✅ | ✅ | `useCardFlip()` |
| Shake on error | ✅ | ✅ | `useShakeAnimation()` |
| Active player pulse | ✅ | ✅ | `usePulseAnimation()` |
| List entrance | ✅ | ✅ | `useStaggeredEntrance()` |
| Fade in on mount | ✅ | ✅ | `useFadeIn()` |
