// ============================================================
// DREAMCRAFTER — Shared Primitive Components
// These are thin wrappers around RN primitives that auto-apply
// the active theme. Import from here instead of react-native
// directly for consistent visual output.
//
// Usage:
//   import { DcText, DcCard, DcButton, DcInput } from '@dreamcrafter/theme';
// ============================================================

import React from 'react';
import {
  View, Text, Pressable, TextInput,
  ViewStyle, TextStyle, TextInputProps, ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { resolveFontFamily } from '../icons-fonts';
import { androidFontWeight, rippleConfig, HIT_SLOP_SM } from '../platform';
import { webOnly, webCursor, webTransition, webInteractiveStyle, webFocusRing, useHover } from '../web';
import type { SemanticColors } from '../types';

// ── DcView ───────────────────────────────────────────────────
// A View that can accept a theme color token as background
interface DcViewProps {
  children?: React.ReactNode;
  bg?: keyof SemanticColors;
  style?: ViewStyle;
  card?: boolean;      // applies card padding + radius + shadow
  raised?: boolean;    // stronger shadow variant
  [key: string]: any;
}

export function DcView({ children, bg, style, card, raised, ...rest }: DcViewProps) {
  const { theme } = useTheme();
  const shadow = raised ? theme.shadows.md : card ? theme.shadows.sm : theme.shadows.none;

  return (
    <View
      style={[
        bg && { backgroundColor: theme.colors[bg] },
        card && {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.components.card.borderRadius,
          padding: theme.components.card.padding,
          borderWidth: theme.components.card.borderWidth,
          borderColor: theme.colors.border,
        },
        shadow,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

// ── DcText ───────────────────────────────────────────────────
type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label' | 'mono';

interface DcTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: keyof SemanticColors;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: TextStyle;
  [key: string]: any;
}

const variantStyles: Record<TextVariant, { sizeKey: keyof import('./types').FontSize; weight: string; useHeading: boolean }> = {
  h1:        { sizeKey: '4xl', weight: '800', useHeading: true },
  h2:        { sizeKey: '3xl', weight: '700', useHeading: true },
  h3:        { sizeKey: '2xl', weight: '700', useHeading: true },
  h4:        { sizeKey: 'xl',  weight: '600', useHeading: true },
  body:      { sizeKey: 'md',  weight: '400', useHeading: false },
  bodySmall: { sizeKey: 'sm',  weight: '400', useHeading: false },
  caption:   { sizeKey: 'xs',  weight: '400', useHeading: false },
  label:     { sizeKey: 'sm',  weight: '600', useHeading: false },
  mono:      { sizeKey: 'sm',  weight: '400', useHeading: false },
};

export function DcText({ children, variant = 'body', color = 'textPrimary', align, numberOfLines, style, ...rest }: DcTextProps) {
  const { theme } = useTheme();
  const v = variantStyles[variant];
  const baseFont = variant === 'mono'
    ? theme.typography.fontFamily.mono
    : v.useHeading
      ? theme.typography.fontFamily.heading
      : theme.typography.fontFamily.body;

  const fontFamily = resolveFontFamily(baseFont, v.weight);
  const fontSize = theme.typography.fontSize[v.sizeKey];
  const lineHeight = fontSize * theme.typography.lineHeight.normal;

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize,
          // On Android, fontWeight is IGNORED for custom fonts loaded via expo-font.
          // The correct weight is already encoded in the font file name via resolveFontFamily().
          // androidFontWeight() returns {} on Android and { fontWeight } on iOS/web.
          ...androidFontWeight(v.weight),
          lineHeight,
          color: theme.colors[color],
          textAlign: align,
        },
        style,
      ]}
      // Clamp system font scaling to 1.4x max to prevent layout breaking
      maxFontSizeMultiplier={1.4}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {children}
    </Text>
  );
}

// ── DcButton ─────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface DcButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function DcButton({
  label, onPress, variant = 'primary', size = 'md',
  icon, iconPosition = 'left', loading, disabled, fullWidth, style,
}: DcButtonProps) {
  const { theme } = useTheme();
  const comp = theme.components.button;

  const heights: Record<ButtonSize, number> = { sm: comp.heightSm, md: comp.heightMd, lg: comp.heightLg };
  const paddings: Record<ButtonSize, number> = { sm: comp.paddingHorizontalSm, md: comp.paddingHorizontalMd, lg: comp.paddingHorizontalLg };
  const fontSizes: Record<ButtonSize, number> = { sm: theme.typography.fontSize.sm, md: theme.typography.fontSize.md, lg: theme.typography.fontSize.lg };

  const variantStyle: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
    primary:   { bg: theme.colors.primary,    text: theme.colors.textInverse, border: theme.colors.primary },
    secondary: { bg: theme.colors.secondary,  text: theme.colors.textInverse, border: theme.colors.secondary },
    outline:   { bg: 'transparent',           text: theme.colors.primary,     border: theme.colors.primary },
    ghost:     { bg: 'transparent',           text: theme.colors.primary,     border: 'transparent' },
    danger:    { bg: theme.colors.error,      text: '#fff',                   border: theme.colors.error },
  };

  const vs = variantStyle[variant];
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={rippleConfig(vs.border, false)}
      {...hoverProps}
      style={({ pressed }) => [
        {
          height: heights[size],
          paddingHorizontal: paddings[size],
          borderRadius: comp.borderRadius,
          borderWidth: comp.borderWidth,
          borderColor: vs.border,
          backgroundColor: vs.bg,
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          gap: 8,
          opacity: disabled ? 0.45 : 1,
          alignSelf: fullWidth ? 'stretch' as const : 'flex-start' as const,
        },
        webOnly({ transition: webTransition(['background-color', 'box-shadow', 'opacity']) }),
        webInteractiveStyle({ pressed, hovered, disabled }),
        style,
      ]}
      hitSlop={HIT_SLOP_SM}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={{
            fontFamily: resolveFontFamily(theme.typography.fontFamily.heading, '600'),
            fontSize: fontSizes[size],
            color: vs.text,
            ...androidFontWeight('600'),
          }}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </Pressable>
  );
}

// ── DcInput ──────────────────────────────────────────────────
interface DcInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export function DcInput({ label, error, hint, leftIcon, rightIcon, style, ...rest }: DcInputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const comp = theme.components.input;

  const borderColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.borderFocus
      : theme.colors.border;

  return (
    <View style={[{ gap: 6 }, style]}>
      {label && (
        <DcText variant="label" color="textSecondary">{label}</DcText>
      )}
      <View style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: comp.height,
          paddingHorizontal: comp.paddingHorizontal,
          borderRadius: comp.borderRadius,
          borderWidth: comp.borderWidth,
          borderColor,
          backgroundColor: theme.colors.surfaceSunken,
          gap: 8,
        },
        webOnly({ transition: webTransition(['border-color', 'box-shadow']) }),
        focused ? webFocusRing(theme.colors.borderFocus) : {},
      ]}>
        {leftIcon}
        <TextInput
          style={{
            flex: 1,
            fontFamily: resolveFontFamily(theme.typography.fontFamily.body, '400'),
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.textPrimary,
          }}
          placeholderTextColor={theme.colors.textDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon}
      </View>
      {(error || hint) && (
        <DcText variant="caption" color={error ? 'error' : 'textSecondary'}>
          {error ?? hint}
        </DcText>
      )}
    </View>
  );
}

// ── DcDivider ────────────────────────────────────────────────
export function DcDivider({ style }: { style?: ViewStyle }) {
  const { theme } = useTheme();
  return (
    <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border }, style]} />
  );
}

// ── DcBadge ──────────────────────────────────────────────────
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

interface DcBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function DcBadge({ label, variant = 'primary', style }: DcBadgeProps) {
  const { theme } = useTheme();
  const comp = theme.components.badge;

  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    primary:   { bg: theme.colors.primaryLight, text: theme.colors.primary },
    secondary: { bg: theme.colors.secondaryLight, text: theme.colors.secondaryDark },
    success:   { bg: theme.colors.successLight, text: theme.colors.success },
    error:     { bg: theme.colors.errorLight, text: theme.colors.error },
    warning:   { bg: theme.colors.warningLight, text: theme.colors.warning },
    info:      { bg: theme.colors.infoLight, text: theme.colors.info },
  };

  const vc = variantColors[variant];

  return (
    <View style={[
      {
        height: comp.height,
        paddingHorizontal: comp.paddingHorizontal,
        borderRadius: comp.borderRadius,
        backgroundColor: vc.bg,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
      },
      style,
    ]}>
      <Text style={{
        fontFamily: resolveFontFamily(theme.typography.fontFamily.heading, '600'),
        fontSize: theme.typography.fontSize.xs,
        color: vc.text,
        fontWeight: '600',
      }}>
        {label}
      </Text>
    </View>
  );
}
