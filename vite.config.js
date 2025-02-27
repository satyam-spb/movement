import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer/',
    }
  },
  server: {
    headers: {
      "Content-Security-Policy": 
        "frame-ancestors 'self' http://localhost:5173 https://auth.privy.io;"
    }
  }
});