import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? "/zenithrace/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer React et ses dépendances
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Séparer Radix UI components
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
          ],
          // Séparer Leaflet pour la carte
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
    // Optimisations supplémentaires
    chunkSizeWarningLimit: 600,
    minify: 'esbuild', // Utiliser esbuild au lieu de terser
  },
}));
