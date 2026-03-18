// ============================================================
// DREAMCRAFTER — Safe Area & Screen Layout
//
// Handles iOS notch, Dynamic Island, home indicator,
// Android status bar and navigation bar cutouts.
//
// Requires:  expo install react-native-safe-area-context
//
// Setup (do this ONCE in App.tsx before ThemeProvider):
//   import { SafeAreaProvider } from 'react-native-safe-area-context';
//   <SafeAreaProvider>
//     <ThemeProvider ...>
//       <App />
//     </ThemeProvider>
//   </SafeAreaProvider>
//
// Then use DcScreen / DcSafeView instead of raw View.
// ============================================================

import React from 'react';
import {
  View, ScrollView, KeyboardAvoidingView, StyleSheet,
  StatusBar, ViewStyle, ScrollViewProps,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';
import { keyboardBehavior, keyboardVerticalOffset, statusBarStyle, IS_ANDROID } from './platform';
import { useResponsive } from './responsive';

export { SafeAreaProvider };

// ── useSafeInsets ────────────────────────────────────────────
/**
 * Thin wrapper around useSafeAreaInsets.
 * Returns the current safe area insets with a bonus helper
 * that merges insets into ViewStyle padding.
 *
 * Usage:
 *   const { insets, safeStyle } = useSafeInsets();
 *   <View style={safeStyle('top', 'bottom')} />
 */
export function useSafeInsets() {
  const insets = useSafeAreaInsets();

  function safeStyle(...edges: Array<'top' | 'bottom' | 'left' | 'right'>): ViewStyle {
    return {
      paddingTop:    edges.includes('top')    ? insets.top    : undefined,
      paddingBottom: edges.includes('bottom') ? insets.bottom : undefined,
      paddingLeft:   edges.includes('left')   ? insets.left   : undefined,
      paddingRight:  edges.includes('right')  ? insets.right  : undefined,
    };
  }

  return { insets, safeStyle };
}

// ── DcScreen ─────────────────────────────────────────────────
/**
 * The standard full-screen wrapper for every screen in every app.
 *
 * - Sets background color from theme
 * - Controls safe area padding per edge
 * - Manages StatusBar style automatically
 * - Optionally wraps in KeyboardAvoidingView for forms
 *
 * Usage:
 *   <DcScreen edges={['top', 'bottom']}>
 *     <YourContent />
 *   </DcScreen>
 *
 *   // With keyboard avoidance (forms):
 *   <DcScreen edges={['top']} keyboardAvoiding>
 *     <FormContent />
 *   </DcScreen>
 */
interface DcScreenProps {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  keyboardAvoiding?: boolean;
  headerHeight?: number;      // pass if inside a react-navigation header
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollable?: boolean;
  scrollProps?: ScrollViewProps;
}

export function DcScreen({
  children,
  edges = ['top', 'bottom'],
  keyboardAvoiding = false,
  headerHeight = 0,
  style,
  contentStyle,
  scrollable = false,
  scrollProps,
}: DcScreenProps) {
  const { theme, isDark } = useTheme();
  const { responsive } = useResponsive();

  const horizontalPadding = responsive({ phone: theme.spacing[4], tablet: theme.spacing[8], desktop: theme.spacing[16] });

  const inner = scrollable ? (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"   // iOS scroll handles safe area
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
      contentContainerStyle={[
        { paddingHorizontal: horizontalPadding, flexGrow: 1 },
        contentStyle,
      ]}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, paddingHorizontal: horizontalPadding }, contentStyle]}>
      {children}
    </View>
  );

  const screen = (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
    >
      <StatusBar
        barStyle={statusBarStyle(isDark)}
        backgroundColor={IS_ANDROID ? theme.colors.background : 'transparent'}
        translucent={IS_ANDROID}
      />
      {inner}
    </SafeAreaView>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset(headerHeight)}
        style={{ flex: 1 }}
      >
        {screen}
      </KeyboardAvoidingView>
    );
  }

  return screen;
}

// ── DcScrollScreen ───────────────────────────────────────────
/**
 * Convenience: DcScreen with scrollable=true pre-set.
 *
 * Usage:
 *   <DcScrollScreen edges={['top']}>
 *     <LongContent />
 *   </DcScrollScreen>
 */
export function DcScrollScreen(props: Omit<DcScreenProps, 'scrollable'>) {
  return <DcScreen {...props} scrollable />;
}

// ── DcTabBarSpacer ───────────────────────────────────────────
/**
 * Add at the bottom of scrollable content inside screens that
 * have a floating or transparent tab bar, to prevent content
 * being hidden behind it.
 *
 * Usage:
 *   <ScrollView>
 *     <Content />
 *     <DcTabBarSpacer />
 *   </ScrollView>
 */
export function DcTabBarSpacer({ extra = 0 }: { extra?: number }) {
  const { theme } = useTheme();
  const { insets } = useSafeInsets();
  const height = theme.components.tabBar.height + insets.bottom + extra;
  return <View style={{ height }} />;
}

// ── DcHeaderSafeArea ─────────────────────────────────────────
/**
 * A header container that correctly pads for the status bar
 * when building custom headers. Use when NOT using react-navigation.
 */
interface DcHeaderSafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DcHeaderSafeArea({ children, style }: DcHeaderSafeAreaProps) {
  const { theme } = useTheme();
  const { insets } = useSafeInsets();

  return (
    <View style={[
      {
        paddingTop: insets.top,
        backgroundColor: theme.colors.surface,
        ...StyleSheet.flatten(theme.shadows.sm as any),
      },
      style,
    ]}>
      {children}
    </View>
  );
}

// ── DcBottomSheetSafeArea ────────────────────────────────────
/**
 * Wraps the content area of a bottom sheet / modal.
 * Pads for home indicator on iPhone X+ and Android nav bar.
 */
export function DcBottomSheetSafeArea({ children, style }: DcHeaderSafeAreaProps) {
  const { insets } = useSafeInsets();
  return (
    <View style={[{ paddingBottom: Math.max(insets.bottom, 16) }, style]}>
      {children}
    </View>
  );
}
