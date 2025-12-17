import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/learn_dbt/',
  build: {
    outDir: 'dist/learn_dbt',
    assetsDir: 'assets',
  },
})
