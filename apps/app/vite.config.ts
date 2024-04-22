/// <reference types='vitest' />
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig, type ConfigEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

const vitePwaConfig = (isProd: boolean) =>
  VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: !isProd,
    },
    srcDir: 'src',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
    },
    includeAssets: [
      'favicon.ico',
      'favicon-16x16.ico',
      'favicon-32x32.ico',
      'robots.txt',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
      'apple-touch-icon.png',
      'mstile-150x150.png',
      'safari-pinned-tab.svg',
    ],
    manifest: {
      name: 'Tastery',
      short_name: 'Tastery',
      description:
        'Tastery is a vibrant food discovery platform where you can explore a wide variety of recipes and share your own culinary creations with the world. ' +
        'Dive into the world of flavors with Tastery!',
      theme_color: '#76B124',
      icons: [
        {
          src: 'android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  });

export default ({ mode }: ConfigEnv) => {
  const isProd = mode === 'production';

  const pnpmStorePath = path.resolve(process.cwd(), 'node_modules/.pnpm');

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    publicDir: path.resolve(__dirname, './public'),
    plugins: [vue(), tsconfigPaths(), vitePwaConfig(isProd)],
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./unit.setup.ts'],
      include: ['src/**/*.{test,spec}.ts'],
      passWithNoTests: true,
      reporters: ['default'],
      coverage: { reportsDirectory: '../../coverage/apps/app', provider: 'v8' },
      cache: {
        dir: '../../node_modules/.vitest',
      },
    },
    server: {
      fs: {
        // Allow serving assets from pnpm's store directory
        allow: [path.resolve(__dirname, 'node_modules'), pnpmStorePath],
      },
    },
  });
};
