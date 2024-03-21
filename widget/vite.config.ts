import vue from '@vitejs/plugin-vue';
import { tsconfigBaseAliases } from 'nx-vue3-vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      ...tsconfigBaseAliases(__dirname),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: path.resolve(__dirname, './public'),
  plugins: [vue()],
});
