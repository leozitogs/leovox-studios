import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Porta fixa 5173: o Claude Code valida sempre no servidor existente,
// nunca sobe uma instância própria (regra 3 do contrato de trabalho).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      // build multipagina: a home e a cena 404 (servida pela
      // hospedagem em qualquer URL quebrada)
      input: {
        main: resolve(__dirname, 'index.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
})
