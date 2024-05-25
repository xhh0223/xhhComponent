import inject from '@rollup/plugin-inject'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

const PageDir = path.resolve(__dirname, 'src')

export default defineConfig({
  root: PageDir,
  plugins: [
    react(),
    inject({
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@style': path.resolve(__dirname, 'src', 'style'),
      '@logic-component': path.resolve(__dirname, '..', 'component', 'src'),
      '@/utils': path.resolve(__dirname, '..', 'component', 'src', 'utils'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
})
