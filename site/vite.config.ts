import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset URLs relative so the built site works from the
// domain root or from a sub-folder on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    assetsInlineLimit: 0,
    // Pages: the homepage, the Project Page and the booklog (each replaces
    // the legacy page of the same name in the deployed site).
    rollupOptions: {
      input: {
        main: 'index.html',
        projects: 'projects.html',
        booklog: 'booklog.html',
      },
    },
  },
});
