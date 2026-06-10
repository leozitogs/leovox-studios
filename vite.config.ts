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
})
