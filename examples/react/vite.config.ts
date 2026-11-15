import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative assets also work under /geospatial-scene-engine/examples/react/.
  base: './',
  plugins: [react()],
  resolve: {
    // `three-map-terrain` is linked from the repo root: make it use this
    // example's copy of three instead of bundling a second one
    dedupe: ['three']
  },
  // three.js alone is above Vite's 500 kB warning
  build: { chunkSizeWarningLimit: 1300 }
})
