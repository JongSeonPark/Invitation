import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Invitation/', // Repository name
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        classic: 'classic.html',
        game: 'game.html',
      },
    },
  },
})
