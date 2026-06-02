import { defineConfig } from 'vite';

export default defineConfig({
  base: '/baseline-status/',
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
  },
});
