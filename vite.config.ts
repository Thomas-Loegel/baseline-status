import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'BaselineStatus',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'baseline-status.js' : 'baseline-status.umd.cjs'),
    },
    rollupOptions: {
      // Zéro dépendance runtime : rien à externaliser.
      external: [],
    },
  },
  plugins: [
    dts({
      include: ['src'],
      rollupTypes: false,
    }),
  ],
});
