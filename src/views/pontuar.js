import { pontuarCodigo, CodigoInvalidoError, AtividadeRepetidaError } from '../scoring.js';
import { buscarPerfil } from '../auth.js';
import { hero } from '../utils/hero.js';

// Tela de destino de quem chegou por um QR code lido pela câmera do
// celular: registra o ponto na hora e mostra o resultado.
export function render(raiz, { uid, codigo }, navegar) {
  raiz.innerHTML = `
    ${hero({ chapeu: 'Registrando', titulo: 'Só um instante...' })}
    <div class="corpo"><p class="carregando">Confirmando sua pontuação...</p></div>
  `;

  async function mostrar(interno, botao = 'Ver minha pontuação') {
    const perfil = await buscarPerfil(uid);
    raiz.innerHTML = `
      ${hero({ chapeu: 'Pronto', titulo: 'Pontuação atualizada' })}
      <div class="corpo">
        ${interno}
        <div class="rodape-nav">
          <button id="botao-continuar" class="botao">${botao}</button>
        </div>
      </div>
    `;
    raiz.querySelector('#botao-continuar').addEventListener('click', async () => {
      const view = await import('./inicio.js');
      navegar(view, { uid, perfil });
    });
  }

  pontuarCodigo(uid, codigo)
    .then(({ atividade, pontosGanhos, pontosAtualizados }) => {
      mostrar(`
        <div class="bloco-pontos">
          <div>
            <div class="rotulo">Você ganhou</div>
            <div class="colocacao">${atividade.nome}</div>
          </div>
          <div style="text-align: right;"><div class="numero">+${pontosGanhos}</div></div>
          <div class="estrela">★</div>
        </div>
        <div class="confirmacao">
          <span class="marca">✓</span>
          <div><b>Total: ${pontosAtualizados} pontos</b><br /><span>Continue participando das dinâmicas</span></div>
        </div>
      `);
    })
    .catch(async (erro) => {
      if (erro instanceof AtividadeRepetidaError) {
        mostrar(`<div class="aviso">Você já pontuou em <strong>${erro.message}</strong>. Procure outra dinâmica!</div>`, 'Voltar');
        return;
      }
      if (erro instanceof CodigoInvalidoError) {
        mostrar('<div class="aviso">Esse QR code não é de uma dinâmica do evento.</div>', 'Voltar');
        return;
      }
      console.error(erro);
      mostrar('<div class="aviso">Não deu pra registrar agora. Tente escanear de novo.</div>', 'Voltar');
    });
}
