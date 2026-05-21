import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Config separada do vite.config.js (que usa o plugin Base44, desnecessário em testes).
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(process.cwd(), './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
  },
});
