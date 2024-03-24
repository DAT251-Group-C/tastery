/// <reference types='vitest' />
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig, type ConfigEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    plugins: [vue(), tsconfigPaths()],
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
