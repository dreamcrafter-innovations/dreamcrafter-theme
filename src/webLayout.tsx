// ============================================================
// DREAMCRAFTER — Web Layout Components
//
// On web, the layout model is fundamentally different from mobile:
//
//   MOBILE:  Bottom tab bar, full-screen views, drawer menus
//   TABLET:  Still bottom tabs or a collapsible sidebar
//   DESKTOP: Persistent sidebar or top nav, max-width content, hover states
//
// These components handle the switch automatically based on screen width.
//
// ── Usage ─────────────────────────────────────────────────────
//
// Replace your navigator shell with DcAppShell — it picks the
// right layout (bottom tabs, sidebar, or top nav) for you:
//
//   <DcAppShell
//     navItems={[
//       { key: 'home',     label: 'Home',     icon: 'home',     screen: <HomeScreen /> },
//       { key: 'play',     label: 'Play',     icon: 'play',     screen: <PlayScreen /> },
//       { key: 'settings', label: 'Settings', icon: 'settings', screen: <SettingsScreen /> },
//     ]}
//   />
//
// Or use individual layout primitives for custom nav setups.
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, ViewStyle, Platform,
} from 'react-native';
import { useTheme } from './ThemeProvider';
import { useResponsive } from './responsive';
import { useSafeInsets } from './safeArea';
import { platformShadow, androidFontWeight } from './platform';
import { resolveFontFamily } from './icons-fonts';
import { DcIcon } from './icons-fonts';
import { webOnly, webCursor, webTransition, webInteractiveStyle, webMaxWidth, useHover } from './web';
import type { IconName } from './icons-fonts';

const IS_WEB = Platform.OS === 'web';

// ── Nav item definition ──────────────────────────────────────
export interface NavItem {
  key: string;
  label: string;
  icon: IconName;
  screen: React.ReactNode;
  badge?: string | number;  // notification badge
}

// ── DcAppShell ───────────────────────────────────────────────
/**
 * Top-level layout shell. Renders the correct navigation pattern
 * for the current screen size automatically:
 *
 *   phone   → DcBottomTabBar
 *   tablet  → DcSidebarNav (collapsed, icon-only)
 *   desktop → DcSidebarNav (expanded, icon + label)
 *
 * This is the main replacement for a bare react-navigation shell
 * when you want consistent cross-platform nav without extra deps.
 */
interface DcAppShellProps {
  navItems: NavItem[];
  initialKey?: string;
  headerTitle?: string;
  headerRight?: React.ReactNode;
}

export function DcAppShell({ navItems, initialKey, headerTitle, headerRight }: DcAppShellProps) {
  const [activeKey, setActiveKey] = useState(initialKey ?? navItems[0]?.key);
  const { isTablet, isDesktop } = useResponsive();
  const activeScreen = navItems.find(n => n.key === activeKey)?.screen;

  if (isDesktop || isTablet) {
    return (
      <DcSidebarLayout
        navItems={navItems}
        activeKey={activeKey}
        onNav={setActiveKey}
        collapsed={isTablet && !isDesktop}
      >
        {activeScreen}
      </DcSidebarLayout>
    );
  }

  return (
    <DcBottomTabLayout
      navItems={navItems}
      activeKey={activeKey}
      onNav={setActiveKey}
      headerTitle={headerTitle}
      headerRight={headerRight}
    >
      {activeScreen}
    </DcBottomTabLayout>
  );
}

// ── DcSidebarLayout ──────────────────────────────────────────
/**
 * Desktop / tablet layout with a persistent left sidebar.
 * Collapsed = icon-only sidebar (tablet).
 * Expanded = icon + label sidebar (desktop).
 */
interface DcSidebarLayoutProps {
  navItems: NavItem[];
  activeKey: string;
  onNav: (key: string) => void;
  children: React.ReactNode;
  collapsed?: boolean;
}

export function DcSidebarLayout({ navItems, activeKey, onNav, children, collapsed = false }: DcSidebarLayoutProps) {
  const { theme } = useTheme();
  const sidebarWidth = collapsed ? 64 : 220;

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background }}>
      {/* Sidebar */}
      <View style={[
        {
          width: sidebarWidth,
          backgroundColor: theme.colors.surface,
          borderRightWidth: 1,
          borderRightColor: theme.colors.border,
          paddingVertical: theme.spacing[4],
          paddingHorizontal: collapsed ? theme.spacing[2] : theme.spacing[3],
        },
        platformShadow(theme.shadows.sm),
        webOnly({ transition: `width ${theme.animation.duration.normal}ms ease` }),
      ]}>
        {/* Brand mark */}
        <View style={{
          paddingHorizontal: collapsed ? 0 : theme.spacing[2],
          paddingBottom: theme.spacing[6],
          alignItems: collapsed ? 'center' : 'flex-start',
        }}>
          <Text style={{
            fontFamily: resolveFontFamily(theme.typography.fontFamily.heading, '800'),
            fontSize: collapsed ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
            color: theme.colors.primary,
            ...androidFontWeight('800'),
            ...webOnly({ letterSpacing: '0.05em' as any }),
          }}>
            {collapsed ? 'DC' : 'DREAMCRAFTER'}
          </Text>
        </View>

        {/* Nav items */}
        {navItems.map(item => (
          <SidebarNavItem
            key={item.key}
            item={item}
            active={item.key === activeKey}
            collapsed={collapsed}
            onPress={() => onNav(item.key)}
          />
        ))}
      </View>

      {/* Content area */}
      <View style={[{ flex: 1 }, webOnly({ overflow: 'auto' as any })]}>
        <DcWebContainer>
          {children}
        </DcWebContainer>
      </View>
    </View>
  );
}

function SidebarNavItem({ item, active, collapsed, onPress }: {
  item: NavItem; active: boolean; collapsed: boolean; onPress: () => void;
}) {
  const { theme } = useTheme();
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      onPress={onPress}
      {...(IS_WEB ? hoverProps : {})}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          paddingVertical: theme.spacing[3],
          paddingHorizontal: collapsed ? theme.spacing[2] : theme.spacing[3],
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing[1],
          backgroundColor: active
            ? theme.colors.primaryLight
            : hovered
              ? theme.colors.surfaceSunken
              : 'transparent',
          justifyContent: collapsed ? 'center' : 'flex-start',
        },
        webOnly({
          transition: webTransition(['background-color']),
          cursor: 'pointer' as any,
        }),
      ]}
    >
      <DcIcon
        name={item.icon}
        size="md"
        color={active ? theme.colors.primary : theme.colors.textSecondary}
      />
      {!collapsed && (
        <Text style={{
          fontFamily: resolveFontFamily(theme.typography.fontFamily.body, active ? '600' : '400'),
          fontSize: theme.typography.fontSize.sm,
          color: active ? theme.colors.primary : theme.colors.textSecondary,
          ...androidFontWeight(active ? '600' : '400'),
          flex: 1,
        }}>
          {item.label}
        </Text>
      )}
      {item.badge !== undefined && !collapsed && (
        <View style={{
          backgroundColor: theme.colors.accent,
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}>
          <Text style={{
            fontFamily: resolveFontFamily(theme.typography.fontFamily.heading, '700'),
            fontSize: 10,
            color: theme.colors.textInverse,
            ...androidFontWeight('700'),
          }}>
            {item.badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ── DcBottomTabLayout ────────────────────────────────────────
/**
 * Mobile layout with a bottom tab bar and optional header.
 * Standard for phone — the same component you'd build manually
 * in react-navigation but self-contained and theme-aware.
 */
interface DcBottomTabLayoutProps {
  navItems: NavItem[];
  activeKey: string;
  onNav: (key: string) => void;
  children: React.ReactNode;
  headerTitle?: string;
  headerRight?: React.ReactNode;
}

export function DcBottomTabLayout({
  navItems, activeKey, onNav, children, headerTitle, headerRight
}: DcBottomTabLayoutProps) {
  const { theme } = useTheme();
  const { insets } = useSafeInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Optional header */}
      {headerTitle && (
        <View style={[
          {
            paddingTop: insets.top,
            paddingHorizontal: theme.spacing[4],
            paddingBottom: theme.spacing[3],
            backgroundColor: theme.colors.surface,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          platformShadow(theme.shadows.xs),
        ]}>
          <Text style={{
            fontFamily: resolveFontFamily(theme.typography.fontFamily.heading, '700'),
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.textPrimary,
            ...androidFontWeight('700'),
          }}>
            {headerTitle}
          </Text>
          {headerRight}
        </View>
      )}

      {/* Screen content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Bottom tab bar */}
      <View style={[
        {
          flexDirection: 'row',
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: insets.bottom,
          height: theme.components.tabBar.height + insets.bottom,
        },
        platformShadow({ ...theme.shadows.md, shadowOffset: { width: 0, height: -2 } }),
      ]}>
        {navItems.map(item => (
          <BottomTabItem
            key={item.key}
            item={item}
            active={item.key === activeKey}
            onPress={() => onNav(item.key)}
          />
        ))}
      </View>
    </View>
  );
}

function BottomTabItem({ item, active, onPress }: {
  item: NavItem; active: boolean; onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          paddingTop: theme.spacing[2],
        },
        webOnly({ cursor: 'pointer' as any }),
      ]}
    >
      <View style={{ position: 'relative' }}>
        <DcIcon
          name={item.icon}
          size="lg"
          color={active ? theme.colors.primary : theme.colors.textDisabled}
        />
        {item.badge !== undefined && (
          <View style={{
            position: 'absolute',
            top: -4,
            right: -6,
            backgroundColor: theme.colors.error,
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
          }}>
            <Text style={{ fontSize: 9, color: '#fff', fontWeight: '700' }}>
              {item.badge}
            </Text>
          </View>
        )}
      </View>
      <Text style={{
        fontFamily: resolveFontFamily(theme.typography.fontFamily.body, active ? '600' : '400'),
        fontSize: theme.components.tabBar.labelSize,
        color: active ? theme.colors.primary : theme.colors.textDisabled,
        ...androidFontWeight(active ? '600' : '400'),
      }}>
        {item.label}
      </Text>
    </Pressable>
  );
}

// ── DcWebContainer ───────────────────────────────────────────
/**
 * Wraps content in a max-width centered container for desktop web.
 * On mobile, this is transparent — content fills the screen normally.
 *
 * Use inside screen components that need to be readable on wide screens.
 *
 * Usage:
 *   <DcWebContainer maxWidth={960}>
 *     <YourContent />
 *   </DcWebContainer>
 */
interface DcWebContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  style?: ViewStyle;
}

export function DcWebContainer({ children, maxWidth = 960, style }: DcWebContainerProps) {
  const { theme } = useTheme();
  const { isDesktop, responsive } = useResponsive();

  return (
    <View style={[
      { flex: 1 },
      webMaxWidth(maxWidth),
      {
        paddingHorizontal: responsive({
          phone:   theme.spacing[4],
          tablet:  theme.spacing[8],
          desktop: theme.spacing[10],
        }),
      },
      style,
    ]}>
      {children}
    </View>
  );
}

// ── DcWebTopNav ──────────────────────────────────────────────
/**
 * A top navigation bar for web-only layouts (landing pages,
 * marketing pages, web apps that don't need a sidebar).
 *
 * Sticks to the top on web, hidden on native.
 */
interface DcWebTopNavProps {
  items: Array<{ key: string; label: string; href?: string; onPress?: () => void }>;
  logo?: React.ReactNode;
  right?: React.ReactNode;
  activeKey?: string;
}

export function DcWebTopNav({ items, logo, right, activeKey }: DcWebTopNavProps) {
  if (!IS_WEB) return null;

  const { theme } = useTheme();

  return (
    <View style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[6],
        height: 60,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      webOnly({ position: 'sticky' as any, top: 0, zIndex: theme.zIndex.sticky }),
      platformShadow(theme.shadows.xs),
    ]}>
      {logo && <View style={{ marginRight: theme.spacing[8] }}>{logo}</View>}

      <View style={{ flexDirection: 'row', flex: 1, gap: theme.spacing[1] }}>
        {items.map(item => (
          <TopNavItem key={item.key} item={item} active={item.key === activeKey} />
        ))}
      </View>

      {right && <View>{right}</View>}
    </View>
  );
}

function TopNavItem({ item, active }: {
  item: { key: string; label: string; onPress?: () => void };
  active: boolean;
}) {
  const { theme } = useTheme();
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      onPress={item.onPress}
      {...(IS_WEB ? hoverProps : {})}
      style={[
        {
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2],
          borderRadius: theme.borderRadius.sm,
          backgroundColor: active ? theme.colors.primaryLight : 'transparent',
        },
        webOnly({
          cursor: 'pointer' as any,
          transition: webTransition(['background-color']),
          ...(hovered && !active && { backgroundColor: theme.colors.surfaceSunken }),
        }),
      ]}
    >
      <Text style={{
        fontFamily: resolveFontFamily(theme.typography.fontFamily.body, active ? '600' : '400'),
        fontSize: theme.typography.fontSize.sm,
        color: active ? theme.colors.primary : theme.colors.textSecondary,
        ...androidFontWeight(active ? '600' : '400'),
      }}>
        {item.label}
      </Text>
    </Pressable>
  );
}
