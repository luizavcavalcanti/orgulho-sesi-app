import { nomeExibicao } from '../auth.js';
import { ATIVIDADES } from '../activities.js';

export function render(raiz, { uid, perfil }, navegar) {
  const concluidas = new Set(perfil.atividadesConcluidas ?? []);

  raiz.innerHTML = `
    <div class="topo-marca">
      <img src="/logo-orgulho-sesi.png" alt="Orgulho de Ser Sesi" />
    </div>
    <div class="tela">
      <div class="placar-pessoal">
        <div class="numero">${perfil.pontos ?? 0}</div>
        <div class="rotulo">pontos de ${nomeExibicao(perfil)}</div>
      </div>import { ATIVIDADES } from '../activities.js';
import { hero } from '../utils/hero.js';
import { posicaoDoParticipante } from '../ranking.js';

export function render(raiz, { uid, perfil }, navegar) {
  const concluidas = new Set(perfil.atividadesConcluidas ?? []);
  const feitas = ATIVIDADES.filter((a) => concluidas.has(a.id));
  const pendentes = ATIVIDADES.filter((a) => !concluidas.has(a.id));

  raiz.innerHTML = `
    ${hero({ chapeu: `Olá, ${perfil.nome}`, titulo: 'Sua pontuação' })}
    <div class="corpo">
      <div class="bloco-pontos">
        <div>
          <div class="rotulo">Total do dia</div>
          <div class="colocacao" id="colocacao">Carregando posição...</div>
        </div>
        <div style="text-align: right;">
          <div class="numero">${perfil.pontos ?? 0}</div>
        </div>
        <div class="estrela">★</div>
      </div>

      <button id="botao-escanear" class="botao botao-azul">Escanear atividade</button>
      <button id="botao-ranking" class="botao-neutro">Ver ranking geral</button>

      <div class="cartao">
        <h3>Atividades do dia</h3>
        ${feitas
          .map(
            (a) => `
              <div class="atividade-feita">
                <span class="marca">✓</span>${a.nome}
                <span class="pontos">+${a.pontos}</span>
              </div>
            `
          )
          .join('')}
        ${pendentes
          .map(
            (a) => `
              <div class="atividade-pendente">
                <span class="marca"></span>${a.nome}
                <span class="pontos">+${a.pontos}</span>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;

  raiz.querySelector('#botao-escanear').addEventListener('click', async () => {
    const view = await import('./scan.js');
    navegar(view, { uid, perfil });
  });

  raiz.querySelector('#botao-ranking').addEventListener('click', async () => {
    const view = await import('./ranking-view.js');
    navegar(view, { uid, perfil });
  });

  posicaoDoParticipante(uid)
    .then((posicao) => {
      const alvo = raiz.querySelector('#colocacao');
      if (!alvo) return;
      alvo.textContent = posicao ? `Você está em ${posicao}º lugar` : 'Escaneie para entrar no ranking';
    })
    .catch(() => {
      const alvo = raiz.querySelector('#colocacao');
      if (alvo) alvo.textContent = '';
    });
}


      <h2 style="font-size: 18px; color: var(--azul-escuro);">Atividades do dia</h2>
      <div class="lista-atividades">
        ${ATIVIDADES.map((atividade) => {
          const feita = concluidas.has(atividade.id);
          return `
            <div class="item-atividade ${feita ? 'feita' : ''}">
              <div class="selo">${feita ? '✓' : ''}</div>
              <div class="info">
                <div class="nome">${atividade.nome}</div>
                <div class="pontos">${feita ? 'concluída' : `+${atividade.pontos} pontos`}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="rodape-nav">
        <button id="botao-escanear" class="botao botao-primario" style="flex: 1;">Escanear QR code</button>
        <button id="botao-ranking" class="botao botao-secundario">Ranking</button>
      </div>
    </div>
  `;

  raiz.querySelector('#botao-escanear').addEventListener('click', () => {
    import('./scan.js').then((view) => navegar(view, { uid, perfil }));
  });

  raiz.querySelector('#botao-ranking').addEventListener('click', () => {
    import('./ranking-view.js').then((view) => navegar(view, { uid, perfil }));
  });
}
