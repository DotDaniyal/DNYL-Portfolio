import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: process.env.DISABLE_HMR !== 'true'
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
});
