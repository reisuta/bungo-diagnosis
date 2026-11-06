// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Astro 7 で既定値が 'jsx' に変わったため、従来どおりの空白圧縮を維持する
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()]
  }
})
