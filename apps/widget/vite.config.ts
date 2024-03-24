/// <reference types='vitest' />
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@resources': path.resolve(__dirname, './resources'),
    },
  },
  plugins: [
    vue(),
    tsconfigPaths(),
    dts({
      entryRoot: 'src',
      copyDtsFiles: true,
      tsconfigPath: path.join(__dirname, 'tsconfig.json'),
    }),
    cssInjectedByJsPlugin(),
  ],
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
  build: {
    sourcemap: false,
    manifest: false,
    emptyOutDir: true,
    cssCodeSplit: false,
    reportCompressedSize: true,
    lib: {
      entry: 'public-api.ts',
      name: 'widget',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      cache: false,
      output: {
        validate: true,
      },
    },
  },
});
