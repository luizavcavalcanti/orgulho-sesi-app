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
      </div>

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
