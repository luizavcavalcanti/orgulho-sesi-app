import { defineConfig } from 'vite';
import { resolve } from 'path';

// Dois pontos de entrada: o app do participante (celular) e o placar
// que fica ligado numa TV separada, sem login.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ranking: resolve(__dirname, 'ranking.html'),
      },
    },
  },
  server: {
    // HTTPS local pra poder testar a câmera fora do celular via mkcert,
    // veja o README se precisar disso durante o desenvolvimento.
    host: true,
  },
});
