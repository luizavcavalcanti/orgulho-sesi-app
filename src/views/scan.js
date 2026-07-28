import { LeitorQR } from '../scanner.js';
import { pontuarAtividade, AtividadeInvalidaError, AtividadeRepetidaError } from '../scoring.js';
import { buscarPerfil } from '../auth.js';
import { hero } from '../utils/hero.js';
import { mostrarToast } from '../utils/toast.js';

const leitor = new LeitorQR();

export function render(raiz, { uid }, navegar) {
  raiz.innerHTML = `
    ${hero({ chapeu: 'Escaneando', titulo: 'Aponte para o QR code' })}
    <div class="corpo">
      <div class="camera"><div id="leitor-camera"></div></div>
      <p class="status-camera" id="status-camera">Ligando a câmera...</p>
      <div id="area-resultado"></div>
      <div class="rodape-nav">
        <button id="botao-cancelar" class="botao-neutro">Cancelar</button>
      </div>
    </div>
  `;

  const status = raiz.querySelector('#status-camera');
  const areaResultado = raiz.querySelector('#area-resultado');

  async function voltarParaInicio() {
    await leitor.parar();
    const perfil = await buscarPerfil(uid);
    const view = await import('./inicio.js');
    navegar(view, { uid, perfil });
  }

  raiz.querySelector('#botao-cancelar').addEventListener('click', voltarParaInicio);

  leitor
    .iniciar(async (atividadeId) => {
      status.textContent = 'Registrando...';
      await leitor.parar();

      try {
        const { atividade } = await pontuarAtividade(uid, atividadeId);
        status.textContent = '';
        areaResultado.innerHTML = `
          <div class="confirmacao">
            <span class="marca">✓</span>
            <div>
              <b>+${atividade.pontos} pontos</b><br />
              <span>${atividade.nome} registrada</span>
            </div>
          </div>
        `;
        setTimeout(voltarParaInicio, 1800);
      } catch (erro) {
        if (erro instanceof AtividadeRepetidaError) {
          status.textContent = '';
          areaResultado.innerHTML = `
            <div class="aviso">Você já pontuou em <strong>${erro.message}</strong>. Procure outra atividade!</div>
          `;
          setTimeout(voltarParaInicio, 2200);
          return;
        }
        if (erro instanceof AtividadeInvalidaError) {
          mostrarToast('Esse QR code não é de uma atividade do evento.', { erro: true });
        } else {
          console.error(erro);
          mostrarToast('Não deu pra registrar o ponto. Tenta de novo.', { erro: true });
        }
        voltarParaInicio();
      }
    })
    .catch((erro) => {
      console.error(erro);
      status.textContent = 'Não consegui acessar a câmera. Verifique a permissão no navegador.';
    });
}

export function destruir() {
  leitor.parar();
}
