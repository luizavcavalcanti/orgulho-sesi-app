import { escutarRanking } from '../ranking.js';
import { nomeExibicao } from '../auth.js';
import { hero } from '../utils/hero.js';

let pararDeEscutar = null;

export function render(raiz, { uid, perfil }, navegar) {
  raiz.innerHTML = `
    ${hero({ chapeu: 'Atualizado agora', titulo: 'Ranking geral' })}
    <div class="corpo">
      <div class="cartao">
        <h3>Top 10 do dia</h3>
        <div id="lista-ranking"><p class="carregando">Carregando...</p></div>
      </div>
      <div class="rodape-nav">
        <button id="botao-voltar" class="botao-neutro">Voltar</button>
      </div>
    </div>
  `;

  raiz.querySelector('#botao-voltar').addEventListener('click', async () => {
    const view = await import('./inicio.js');
    navegar(view, { uid, perfil });
  });

  const lista = raiz.querySelector('#lista-ranking');
  const classePorPodio = { 1: 'ouro', 2: 'prata', 3: 'bronze' };

  pararDeEscutar = escutarRanking(10, (posicoes) => {
    if (posicoes.length === 0) {
      lista.innerHTML = '<p class="carregando">Ninguém pontuou ainda.</p>';
      return;
    }

    lista.innerHTML = posicoes
      .map((pessoa) => {
        const souEu = pessoa.uid === uid;
        const podio = classePorPodio[pessoa.posicao] ?? '';
        return `
          <div class="linha-ranking ${souEu ? 'sou-eu' : ''}">
            <span class="posicao ${podio}">${pessoa.posicao}</span>
            <span class="nome">${nomeExibicao(pessoa)}</span>
            <span class="pontos">${pessoa.pontos}</span>
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
