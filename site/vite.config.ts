import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset URLs relative so the built site works from the
// domain root or from a sub-folder on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    assetsInlineLimit: 0,
    // Two pages: the homepage and the Project Page (replaces projects.html).
    rollupOptions: {
      input: {
        main: 'index.html',
        projects: 'projects.html',
      },
    },
  },
});
