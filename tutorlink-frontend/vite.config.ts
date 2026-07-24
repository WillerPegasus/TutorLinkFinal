import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ⚠️ sockjs-client (dépendance de @stomp/stompjs) référence l'objet
  // Node "global", inexistant dans le navigateur — on le mappe sur
  // globalThis pour éviter "Uncaught ReferenceError: global is not defined".
  define: {
    global: 'globalThis',
  },
});