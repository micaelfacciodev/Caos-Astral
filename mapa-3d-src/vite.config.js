import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' para os assets ficarem com caminho relativo — assim a
// pasta dist/ inteira pode ser copiada como subpasta estática dentro
// do Caos-Astral (ex: /mapa-3d/) e funcionar direto no GitHub Pages,
// sem servidor, sem configuração extra de rota.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
