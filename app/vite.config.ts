import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  publicDir: path.resolve(__dirname, './public'),
  plugins: [vue(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./unit.setup.ts'],
  }
});
