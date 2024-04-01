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
      name: 'Agient',
      short_name: 'Agient',
      description: 'Agient',
      theme_color: '#1c9c4f',
    },
  });

export default ({ mode }: ConfigEnv) => {
  const isProd = mode === 'production';

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@agient/widget': path.resolve(__dirname, `../widget/${isProd ? 'dist' : 'public-api'}`),
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
  });
};
