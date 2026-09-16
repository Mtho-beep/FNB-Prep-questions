import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
// `vite build --mode streamlit` inlines all JS/CSS into one HTML file that
// streamlit_app.py embeds.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'streamlit' ? [viteSingleFile()] : [])],
  build: mode === 'streamlit' ? { outDir: 'streamlit_build', emptyOutDir: true } : undefined,
}))
