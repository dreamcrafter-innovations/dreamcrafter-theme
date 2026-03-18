// /metro.config.base.js  (monorepo root)
// Shared Metro bundler config. Every app's metro.config.js calls this.

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Creates a Metro config that:
 * 1. Watches the full monorepo (so packages/dreamcrafter-theme is visible)
 * 2. Resolves node_modules from both app AND monorepo root
 * 3. Allows asset files (fonts, images) from the shared theme package
 *
 * @param {string} appDir - pass __dirname from your app's metro.config.js
 */
function createMetroConfig(appDir) {
  const monorepoRoot = path.resolve(appDir, '../..');
  const config = getDefaultConfig(appDir);

  // Watch the full monorepo tree — this is what lets Metro find
  // assets in packages/dreamcrafter-theme/assets/
  config.watchFolders = [monorepoRoot];

  // Resolve node_modules from app first, then monorepo root
  // (prevents duplicate React instances which cause runtime crashes)
  config.resolver.nodeModulesPaths = [
    path.resolve(appDir, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ];

  // Deduplicate React — critical for monorepos.
  // Without this you get "Hooks can only be called inside a function component"
  // errors when the theme package and the app have separate React copies.
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react' || moduleName === 'react-native') {
      return {
        filePath: require.resolve(moduleName, {
          paths: [path.resolve(appDir, 'node_modules')],
        }),
        type: 'sourceFile',
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  };

  return config;
}

module.exports = { createMetroConfig };
