import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AIChatbox',
      formats: ['es'],
      fileName: () => 'ai-chatbox.js',
    },
    rollupOptions: {
      // Externalize Vue to avoid bundling it
      external: ['vue', 'marked', 'dompurify'],
      output: {
        // Preserve modules structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Provide proper exports
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
