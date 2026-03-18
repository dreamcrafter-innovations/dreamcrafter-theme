// ============================================================
// DREAMCRAFTER — Animation Compatibility
//
// React Native's animation APIs have 3 specific breakages on web.
// This file fixes all of them and provides game-ready hooks.
//
// ╔══════════════════════════════════════════════════════════╗
// ║  PROBLEM 1 — useNativeDriver: true                       ║
// ║  On web, the native UI thread doesn't exist. Any call    ║
// ║  to Animated.timing/spring with useNativeDriver: true    ║
// ║  throws: "useNativeDriver is not supported because the   ║
// ║  native animated module is missing."                     ║
// ║  This crashes card-flip, role-reveal, bounce effects.    ║
// ╚══════════════════════════════════════════════════════════╝
//
// ╔══════════════════════════════════════════════════════════╗
// ║  PROBLEM 2 — LayoutAnimation                             ║
// ║  LayoutAnimation is completely unsupported in RN Web.    ║
// ║  It does NOTHING — no animation, no error, just silence. ║
// ║  Vote count reshuffles, player list reorders, role       ║
// ║  distribution — all snap without animation on web.       ║
// ╚══════════════════════════════════════════════════════════╝
//
// ╔══════════════════════════════════════════════════════════╗
// ║  PROBLEM 3 — Pressable scale/bounce on web               ║
// ║  Even with useNativeDriver: false, Animated.spring feels ║
// ║  laggy on web vs native. The JS thread handles both      ║
// ║  touch event dispatch AND animation updates, causing     ║
// ║  perceptible frame drops on rapid taps (voting fast in   ║
// ║  Werewolf, tapping charades guesses quickly, etc.)       ║
// ║  On web, CSS transitions are orders of magnitude faster. ║
// ╚══════════════════════════════════════════════════════════╝
//
// ── How to migrate existing code ─────────────────────────────
//
//  BEFORE (breaks on web):
//    Animated.spring(scaleAnim, {
//      toValue: 0.95,
//      useNativeDriver: true,  ← CRASH on web
//    }).start();
//
//  AFTER (works everywhere):
//    const { animatedStyle, onPressIn, onPressOut } = usePressScale();
//    <Animated.View style={animatedStyle}>
//      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} />
//    </Animated.View>
//
//  BEFORE (silently broken on web):
//    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//    setPlayers(newPlayers);
//
//  AFTER:
//    animateLayout(); // cross-platform safe
//    setPlayers(newPlayers);
// ============================================================

import {
  Animated, LayoutAnimation, Platform, Easing,
  LayoutAnimationConfig,
} from 'react-native';
import { useRef, useCallback, useState } from 'react';

const IS_WEB     = Platform.OS === 'web';
const IS_ANDROID = Platform.OS === 'android';
const IS_IOS     = Platform.OS === 'ios';

// ── FIX 1: Safe useNativeDriver value ───────────────────────
/**
 * Use this instead of hardcoding useNativeDriver: true.
 * true on iOS/Android (runs on UI thread, smooth 60fps)
 * false on web (JS thread only, but avoids crash)
 *
 * IMPORTANT: When useNativeDriver is true, you can ONLY animate:
 *   transform, opacity
 * You CANNOT animate: backgroundColor, width, height, padding, etc.
 * This rule applies on ALL platforms, not just web.
 *
 * Usage:
 *   Animated.spring(anim, { toValue: 1, useNativeDriver: nativeDriver }).start();
 */
export const nativeDriver = !IS_WEB;

/**
 * Build a complete Animated config with safe useNativeDriver.
 * Merges your config with the correct driver for the current platform.
 *
 * Usage:
 *   Animated.timing(anim, animConfig({ toValue: 1, duration: 200 })).start();
 */
export function animConfig<T extends object>(config: T): T & { useNativeDriver: boolean } {
  return { ...config, useNativeDriver: nativeDriver };
}

// ── FIX 2: Safe LayoutAnimation ──────────────────────────────
/**
 * LayoutAnimation wrapper that works on all platforms.
 *
 * - iOS: native LayoutAnimation (smooth, cheap)
 * - Android: native LayoutAnimation (requires UIManager flag — see note)
 * - Web: no-op (LayoutAnimation is unsupported; use CSS transitions
 *          via webOnly() for web-specific layout animations)
 *
 * ANDROID NOTE: You must enable LayoutAnimation once at app start:
 *   import { UIManager, Platform } from 'react-native';
 *   if (Platform.OS === 'android') {
 *     UIManager.setLayoutAnimationEnabledExperimental?.(true);
 *   }
 *
 * Usage — replace every LayoutAnimation call with this:
 *   animateLayout();               // spring (default)
 *   animateLayout('ease');         // easeInEaseOut
 *   animateLayout('linear');       // linear
 *   animateLayout(myCustomConfig); // custom config
 */
export function animateLayout(
  preset: 'spring' | 'ease' | 'linear' | LayoutAnimationConfig = 'spring'
): void {
  if (IS_WEB) return; // silently skip — web handles layout via CSS

  if (typeof preset === 'object') {
    LayoutAnimation.configureNext(preset);
    return;
  }

  const map = {
    spring: LayoutAnimation.Presets.spring,
    ease:   LayoutAnimation.Presets.easeInEaseOut,
    linear: LayoutAnimation.Presets.linear,
  };
  LayoutAnimation.configureNext(map[preset]);
}

// ── FIX 3a: usePressScale — card press feedback ──────────────
/**
 * Cross-platform press scale animation.
 * Native: Animated.spring (runs on UI thread via nativeDriver)
 * Web:    CSS transform transition (runs on compositor, no JS cost)
 *
 * This is the most common animation in game apps — tapping a role
 * card, voting button, charades card, etc.
 *
 * Usage:
 *   const { pressProps, animatedStyle } = usePressScale({ scale: 0.93 });
 *
 *   <Animated.View style={animatedStyle}>
 *     <Pressable {...pressProps} onPress={handleVote}>
 *       <RoleCard />
 *     </Pressable>
 *   </Animated.View>
 */
interface PressScaleOptions {
  scale?: number;       // how small on press (default: 0.94)
  friction?: number;    // spring friction (default: 5)
  tension?: number;     // spring tension (default: 150)
  webDuration?: number; // CSS transition duration in ms (default: 120)
}

export function usePressScale(options: PressScaleOptions = {}) {
  const {
    scale = 0.94,
    friction = 5,
    tension = 150,
    webDuration = 120,
  } = options;

  const anim = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const onPressIn = useCallback(() => {
    setPressed(true);
    Animated.spring(anim, animConfig({
      toValue: scale,
      friction,
      tension,
    })).start();
  }, [anim, scale, friction, tension]);

  const onPressOut = useCallback(() => {
    setPressed(false);
    Animated.spring(anim, animConfig({
      toValue: 1,
      friction,
      tension,
    })).start();
  }, [anim, friction, tension]);

  // On web: CSS transform is smoother than JS-driven Animated
  // On native: Animated.Value drives the transform natively
  const animatedStyle = IS_WEB
    ? {
        transform: [{ scale: pressed ? scale : 1 }],
        transition: `transform ${webDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      } as any
    : { transform: [{ scale: anim }] };

  const pressProps = { onPressIn, onPressOut };

  return { pressProps, animatedStyle, anim, pressed };
}

// ── FIX 3b: usePressOpacity — subtle opacity feedback ────────
/**
 * Cross-platform opacity press feedback.
 * Simpler than scale — good for buttons, list items.
 *
 * Usage:
 *   const { pressProps, animatedStyle } = usePressOpacity();
 *   <Animated.View style={animatedStyle}>
 *     <Pressable {...pressProps} onPress={onVote}>...</Pressable>
 *   </Animated.View>
 */
interface PressOpacityOptions {
  activeOpacity?: number;  // opacity on press (default: 0.65)
  duration?: number;       // ms (default: 100)
}

export function usePressOpacity(options: PressOpacityOptions = {}) {
  const { activeOpacity = 0.65, duration = 100 } = options;
  const anim = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const onPressIn = useCallback(() => {
    setPressed(true);
    Animated.timing(anim, animConfig({
      toValue: activeOpacity,
      duration,
      easing: Easing.out(Easing.ease),
    })).start();
  }, [anim, activeOpacity, duration]);

  const onPressOut = useCallback(() => {
    setPressed(false);
    Animated.timing(anim, animConfig({
      toValue: 1,
      duration,
      easing: Easing.out(Easing.ease),
    })).start();
  }, [anim, duration]);

  const animatedStyle = IS_WEB
    ? {
        opacity: pressed ? activeOpacity : 1,
        transition: `opacity ${duration}ms ease`,
      } as any
    : { opacity: anim };

  return { pressProps: { onPressIn, onPressOut }, animatedStyle, anim };
}

// ── Game-specific: useCardFlip ───────────────────────────────
/**
 * Card flip animation — the signature Werewolf role reveal.
 * Flips a card around the Y axis to reveal the role.
 *
 * Works on iOS/Android via useNativeDriver: true (smooth 60fps).
 * Works on web via CSS transform (GPU-accelerated).
 *
 * Usage:
 *   const { frontStyle, backStyle, flip, isFlipped } = useCardFlip();
 *
 *   // Front face (face-down / hidden role)
 *   <Animated.View style={[styles.card, frontStyle]}>
 *     <CardBack />
 *   </Animated.View>
 *
 *   // Back face (role reveal)
 *   <Animated.View style={[styles.card, backStyle]}>
 *     <RoleCard role={player.role} />
 *   </Animated.View>
 *
 *   <Pressable onPress={flip}>Reveal Role</Pressable>
 *
 * IMPORTANT: The container View needs:
 *   style={{ perspective: 1000 }} // only applies on web
 *   // On native, perspective goes inside transform: [{perspective: 1000}]
 */
interface CardFlipOptions {
  duration?: number;    // ms for full flip (default: 400)
  onFlipped?: () => void;
}

export function useCardFlip(options: CardFlipOptions = {}) {
  const { duration = 400, onFlipped } = options;
  const anim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = useCallback(() => {
    const toValue = isFlipped ? 0 : 180;
    Animated.timing(anim, animConfig({
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
    })).start(() => {
      setIsFlipped(v => !v);
      onFlipped?.();
    });
  }, [anim, isFlipped, duration, onFlipped]);

  // Front face: visible 0→90deg, hidden 90→180deg
  const frontRotateY = anim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  // Back face: hidden 0→90deg (rotated 180, so 180→90), visible 90→0
  const backRotateY = anim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = anim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = anim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // IMPORTANT: backfaceVisibility is required to hide the back of
  // each face while the other is showing. Supported on iOS/Android.
  // On web, RN Web translates this to CSS backface-visibility.
  const frontStyle = {
    transform: [{ rotateY: frontRotateY }],
    opacity: frontOpacity,
    backfaceVisibility: 'hidden' as const,
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
  };

  const backStyle = {
    transform: [{ rotateY: backRotateY }],
    opacity: backOpacity,
    backfaceVisibility: 'hidden' as const,
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
  };

  // Container style — perspective must be set differently per platform
  const containerStyle = IS_WEB
    ? { perspective: 1000 } as any     // CSS property, web only
    : {};                               // On native: add transform: [{perspective: 1000}] to YOUR card style

  return { frontStyle, backStyle, containerStyle, flip, isFlipped, anim };
}

// ── Game-specific: useShakeAnimation ─────────────────────────
/**
 * Horizontal shake — for wrong vote, invalid action, error feedback.
 * Common in game UIs: shake when trying to vote after voting is closed.
 *
 * Usage:
 *   const { shakeStyle, shake } = useShakeAnimation();
 *   <Animated.View style={shakeStyle}><VoteButton /></Animated.View>
 *   // trigger on invalid action:
 *   shake();
 */
export function useShakeAnimation() {
  const anim = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
    // Reset then run sequence of rapid oscillations
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, animConfig({ toValue: 10,  duration: 50, easing: Easing.linear })),
      Animated.timing(anim, animConfig({ toValue: -10, duration: 50, easing: Easing.linear })),
      Animated.timing(anim, animConfig({ toValue: 8,   duration: 40, easing: Easing.linear })),
      Animated.timing(anim, animConfig({ toValue: -8,  duration: 40, easing: Easing.linear })),
      Animated.timing(anim, animConfig({ toValue: 4,   duration: 35, easing: Easing.linear })),
      Animated.timing(anim, animConfig({ toValue: 0,   duration: 35, easing: Easing.linear })),
    ]).start();
  }, [anim]);

  const shakeStyle = { transform: [{ translateX: anim }] };

  return { shakeStyle, shake, anim };
}

// ── Game-specific: usePulseAnimation ─────────────────────────
/**
 * Continuous pulse — for active player indicator, timer countdown,
 * "waiting for others" states. Loops until stopped.
 *
 * Usage:
 *   const { pulseStyle, start, stop } = usePulseAnimation();
 *   useEffect(() => { start(); return () => stop(); }, []);
 *   <Animated.View style={pulseStyle}><ActivePlayerBadge /></Animated.View>
 */
interface PulseOptions {
  minScale?: number;  // default 0.97
  maxScale?: number;  // default 1.03
  duration?: number;  // ms per pulse (default 800)
}

export function usePulseAnimation(options: PulseOptions = {}) {
  const { minScale = 0.97, maxScale = 1.03, duration = 800 } = options;
  const anim = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const start = useCallback(() => {
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, animConfig({ toValue: maxScale, duration: duration / 2, easing: Easing.inOut(Easing.ease) })),
        Animated.timing(anim, animConfig({ toValue: minScale, duration: duration / 2, easing: Easing.inOut(Easing.ease) })),
      ])
    );
    animRef.current.start();
  }, [anim, minScale, maxScale, duration]);

  const stop = useCallback(() => {
    animRef.current?.stop();
    Animated.spring(anim, animConfig({ toValue: 1, friction: 5, tension: 150 })).start();
  }, [anim]);

  const pulseStyle = { transform: [{ scale: anim }] };
  return { pulseStyle, start, stop, anim };
}

// ── Game-specific: useFadeIn ──────────────────────────────────
/**
 * Simple fade-in on mount — for role cards appearing, player
 * joining the lobby, results screen appearing.
 *
 * Usage:
 *   const { fadeStyle } = useFadeIn({ duration: 400, delay: 200 });
 *   <Animated.View style={fadeStyle}><RoleReveal /></Animated.View>
 */
interface FadeInOptions {
  duration?: number;  // default 300
  delay?: number;     // default 0
  from?: number;      // starting opacity, default 0
}

export function useFadeIn(options: FadeInOptions = {}) {
  const { duration = 300, delay = 0, from = 0 } = options;
  const anim = useRef(new Animated.Value(from)).current;

  // Run once on mount
  const startRef = useRef(false);
  if (!startRef.current) {
    startRef.current = true;
    // Use setTimeout to defer past first render
    setTimeout(() => {
      Animated.timing(anim, animConfig({
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.ease),
      })).start();
    }, 0);
  }

  return { fadeStyle: { opacity: anim }, anim };
}

// ── Game-specific: useStaggeredEntrance ──────────────────────
/**
 * Staggered fade+slide entrance for lists of items.
 * Perfect for the player lobby (each player card slides in with
 * a slight delay), or role distribution results.
 *
 * Usage:
 *   const getItemStyle = useStaggeredEntrance(players.length);
 *   {players.map((p, i) => (
 *     <Animated.View key={p.id} style={getItemStyle(i)}>
 *       <PlayerCard player={p} />
 *     </Animated.View>
 *   ))}
 */
interface StaggerOptions {
  staggerMs?: number;    // delay between items (default: 60)
  duration?: number;     // each item animation duration (default: 300)
  fromY?: number;        // starting Y offset in dp (default: 20)
}

export function useStaggeredEntrance(itemCount: number, options: StaggerOptions = {}) {
  const { staggerMs = 60, duration = 300, fromY = 20 } = options;

  // Create one animated value per item
  const anims = useRef(
    Array.from({ length: itemCount }, () => new Animated.ValueXY({ x: 0, y: fromY }))
  ).current;
  const opacities = useRef(
    Array.from({ length: itemCount }, () => new Animated.Value(0))
  ).current;

  const startRef = useRef(false);
  if (!startRef.current && itemCount > 0) {
    startRef.current = true;
    setTimeout(() => {
      const animations = anims.map((anim, i) =>
        Animated.parallel([
          Animated.timing(anim, animConfig({
            toValue: { x: 0, y: 0 },
            duration,
            delay: i * staggerMs,
            easing: Easing.out(Easing.cubic),
          })),
          Animated.timing(opacities[i], animConfig({
            toValue: 1,
            duration,
            delay: i * staggerMs,
            easing: Easing.out(Easing.ease),
          })),
        ])
      );
      Animated.parallel(animations).start();
    }, 0);
  }

  // Returns the animated style for item at index i
  function getItemStyle(index: number) {
    if (index >= anims.length) return {};
    return {
      opacity: opacities[index],
      transform: [{ translateY: anims[index].y }],
    };
  }

  return getItemStyle;
}

// ── Android LayoutAnimation enabler ──────────────────────────
/**
 * Call this ONCE in App.tsx on Android to enable LayoutAnimation.
 * It's disabled by default on Android (but on by default on iOS).
 *
 * Usage in App.tsx:
 *   import { enableAndroidLayoutAnimation } from '@dreamcrafter/theme';
 *   enableAndroidLayoutAnimation(); // call before any render
 */
export function enableAndroidLayoutAnimation(): void {
  if (!IS_ANDROID) return;
  const { UIManager } = require('react-native');
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}
