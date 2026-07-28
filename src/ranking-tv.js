import './ranking-tv.css';
import { escutarRanking } from './ranking.js';
import { nomeExibicao } from './auth.js';

const QUANTIDADE_EXIBIDA = 15;
const raiz = document.getElementById('app');

raiz.innerHTML = `
  <div class="tela-tv">import './ranking-tv.css';
import { escutarRanking } from './ranking.js';
import { nomeExibicao } from './auth.js';

const QUANTIDADE_EXIBIDA = 15;

const raiz = document.getElementById('app');
raiz.innerHTML = `
  <div class="tv">
    <div class="tv-topo">
      <div class="chevrons">›››</div>
      <img src="/logo-orgulho-sesi.png" alt="Orgulho de Ser Sesi" />
      <div class="titulo">
        <span class="chapeu">Atualizado em tempo real</span>
        <h1>Ranking do dia</h1>
      </div>
    </div>
    <div class="tv-corpo" id="tv-corpo"></div>
  </div>
`;

const corpo = document.getElementById('tv-corpo');
const classePorPodio = ['primeiro', 'segundo', 'terceiro'];

escutarRanking(QUANTIDADE_EXIBIDA, (posicoes) => {
  if (posicoes.length === 0) {
    corpo.innerHTML = '<div class="tv-vazio">Aguardando as primeiras pontuações...</div>';
    return;
  }

  const podio = posicoes.slice(0, 3);
  const demais = posicoes.slice(3);

  corpo.innerHTML = `
    <div class="podio">
      ${podio
        .map(
          (pessoa, indice) => `
            <div class="podio-lugar ${classePorPodio[indice]}">
              <div class="medalha">${pessoa.posicao}º</div>
              <div class="nome">${nomeExibicao(pessoa)}</div>
              <div class="pontos">${pessoa.pontos}</div>
              ${indice === 0 ? '<div class="estrela">★</div>' : ''}
            </div>
          `
        )
        .join('')}
    </div>
    ${
      demais.length
        ? `<div class="demais">
            ${demais
              .map(
                (pessoa) => `
                  <div class="demais-linha">
                    <span class="posicao">${pessoa.posicao}º</span>
                    <span class="nome">${nomeExibicao(pessoa)}</span>
                    <span class="pontos">${pessoa.pontos}</span>
                  </div>
                `
              )
              .join('')}
          </div>`
        : ''
    }
  `;
});

    <div class="cabecalho-tv">
      <img src="/logo-orgulho-sesi.png" alt="Orgulho de Ser Sesi" />
      <h1>Ranking do dia</h1>
    </div>
    <div id="conteudo-ranking"></div>
  </div>
`;

const medalhas = ['🥇', '🥈', '🥉'];
const conteudo = document.getElementById('conteudo-ranking');

escutarRanking(QUANTIDADE_EXIBIDA, (posicoes) => {
  if (posicoes.length === 0) {
    conteudo.innerHTML = '<div class="tv-vazio">Aguardando as primeiras pontuações...</div>';
    return;
  }

  const podio = posicoes.slice(0, 3);
  const resto = posicoes.slice(3);
  const classePorPosicao = ['primeiro', 'segundo', 'terceiro'];

  conteudo.innerHTML = `
    <div class="podio">
      ${podio
        .map(
          (pessoa, indice) => `
            <div class="podio-lugar ${classePorPosicao[indice]}">
              <div class="podio-medalha">${medalhas[indice]}</div>
              <div class="podio-nome">${nomeExibicao(pessoa)}</div>
              <div class="podio-pontos">${pessoa.pontos}</div>
            </div>
          `
        )
        .join('')}
    </div>
    ${
      resto.length
        ? `<div class="resto-lista">
            ${resto
              .map(
                (pessoa) => `
                  <div class="resto-linha">
                    <div class="posicao">${pessoa.posicao}º</div>
                    <div class="nome">${nomeExibicao(pessoa)}</div>
                    <div class="pontos">${pessoa.pontos} pts</div>
                  </div>
                `
              )
              .join('')}
          </div>`
        : ''
    }
  `;
});
