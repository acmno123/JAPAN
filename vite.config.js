import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages project sites live below /<repository>/; the workflow sets
  // VITE_BASE_PATH for that build. Local and desktop builds stay at /.
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 1420, strictPort: true,
    watch: { ignored: ['**/node_modules/**', '**/src-tauri/**', '**/archive/**', '**/target/**'] },
  },
  clearScreen: false,
  build: {
    outDir: 'dist', emptyOutDir: true, sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: item => item.name?.endsWith('.css') ? 'assets/app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
