import { escutarRanking } from '../ranking.js';
import { nomeExibicao } from '../auth.js';

let pararDeEscutar = null;

export function render(raiz, { uid, perfil }, navegar) {
  raiz.innerHTML = `
    <div class="tela">
      <h1 class="tela-titulo" style="font-size: 22px;">Ranking geral</h1>
      <div id="lista-ranking" class="lista-atividades">
        <p class="carregando">Carregando...</p>
      </div>
      <button id="botao-voltar" class="botao botao-secundario">Voltar</button>
    </div>
  `;

  raiz.querySelector('#botao-voltar').addEventListener('click', () => {
    import('./inicio.js').then((view) => navegar(view, { uid, perfil }));
  });

  const lista = raiz.querySelector('#lista-ranking');
  pararDeEscutar = escutarRanking(20, (posicoes) => {
    if (posicoes.length === 0) {
      lista.innerHTML = '<p class="carregando">Ninguém pontuou ainda.</p>';
      return;
    }

    lista.innerHTML = posicoes
      .map((pessoa) => {
        const souEu = pessoa.uid === uid;
        return `
          <div class="item-atividade" style="${souEu ? 'border-color: var(--azul); border-width: 3px;' : ''}">
            <div class="selo">${pessoa.posicao}</div>
            <div class="info">
              <div class="nome">${nomeExibicao(pessoa)}${souEu ? ' (você)' : ''}</div>
            </div>
            <div class="pontos">${pessoa.pontos} pts</div>
          </div>
        `;
      })
      .join('');
  });
}

export function destruir() {
  pararDeEscutar?.();
  pararDeEscutar = null;
}
