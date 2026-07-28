import { LeitorQR } from '../scanner.js';
import { pontuarAtividade, AtividadeInvalidaError, AtividadeRepetidaError } from '../scoring.js';
import { buscarPerfil } from '../auth.js';
import { mostrarToast } from '../utils/toast.js';

const leitor = new LeitorQR();

export function render(raiz, { uid }, navegar) {
  raiz.innerHTML = `
    <div class="tela">
      <h1 class="tela-titulo" style="font-size: 22px;">Aponte pro QR code</h1>
      <div class="leitor-qr">
        <div id="leitor-camera"></div>
      </div>
      <p class="leitor-status" id="status-leitor">Ligando a câmera...</p>
      <button id="botao-voltar" class="botao botao-secundario">Voltar</button>
    </div>
  `;

  const status = raiz.querySelector('#status-leitor');
  raiz.querySelector('#botao-voltar').addEventListener('click', async () => {
    await leitor.parar();
    const perfil = await buscarPerfil(uid);
    import('./inicio.js').then((view) => navegar(view, { uid, perfil }));
  });

  leitor
    .iniciar(async (atividadeId) => {
      status.textContent = 'Lido! Registrando ponto...';
      await leitor.parar();

      try {
        const { atividade, pontosAtualizados } = await pontuarAtividade(uid, atividadeId);
        import('./resultado.js').then((view) =>
          navegar(view, { uid, atividade, pontosAtualizados, sucesso: true })
        );
      } catch (erro) {
        if (erro instanceof AtividadeRepetidaError) {
          import('./resultado.js').then((view) =>
            navegar(view, { uid, jaFeita: true, nomeAtividade: erro.message, sucesso: false })
          );
          return;
        }
        if (erro instanceof AtividadeInvalidaError) {
          mostrarToast('Esse QR code não é de uma atividade válida.', { erro: true });
        } else {
          console.error(erro);
          mostrarToast('Não deu pra registrar o ponto. Tenta de novo.', { erro: true });
        }
        const perfil = await buscarPerfil(uid);
        import('./inicio.js').then((view) => navegar(view, { uid, perfil }));
      }
    })
    .catch((erro) => {
      console.error(erro);
      status.textContent = 'Não consegui acessar a câmera. Verifique a permissão.';
    });
}

export function destruir() {
  leitor.parar();
}
