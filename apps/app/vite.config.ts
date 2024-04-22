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
    manifest: {
      name: 'Tastery',
      short_name: 'Tastery',
      description: 'Tastery',
      theme_color: '#1c9c4f',
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
