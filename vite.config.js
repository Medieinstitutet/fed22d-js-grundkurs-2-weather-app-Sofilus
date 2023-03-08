import { defineConfig } from 'vite';

export default defineConfig({
  base: '/fed22d-js-grundkurs-2-weather-app-Sofilus/',
  define: {
    'process.env': {},
  },
  build: {
    target: 'esnext',
  },
});

