import { buscarPerfil } from '../auth.js';

export function render(raiz, params, navegar) {
  const { uid, sucesso, atividade, pontosAtualizados, jaFeita, nomeAtividade } = params;

  const conteudo = sucesso
    ? `
      <div class="resultado-icone">🎉</div>
      <div class="resultado-pontos">+${atividade.pontos}</div>
      <p class="resultado-mensagem"><strong>${atividade.nome}</strong> concluída!<br/>Você agora tem ${pontosAtualizados} pontos.</p>
    `
    : jaFeita
      ? `
        <div class="resultado-icone">👀</div>
        <p class="resultado-mensagem">Você já pontuou em <strong>${nomeAtividade}</strong>. Bora pra próxima atividade!</p>
      `
      : `
        <div class="resultado-icone">🤔</div>
        <p class="resultado-mensagem">Não consegui confirmar essa atividade.</p>
      `;

  raiz.innerHTML = `
    <div class="tela">
      <div class="cartao" style="display: flex; flex-direction: column; gap: 12px;">
        ${conteudo}
      </div>
      <div class="rodape-nav">
        <button id="botao-escanear-outra" class="botao botao-primario" style="flex: 1;">Escanear outra</button>
        <button id="botao-voltar-inicio" class="botao botao-secundario">Início</button>
      </div>
    </div>
  `;

  raiz.querySelector('#botao-escanear-outra').addEventListener('click', () => {
    import('./scan.js').then((view) => navegar(view, { uid }));
  });

  raiz.querySelector('#botao-voltar-inicio').addEventListener('click', async () => {
    const perfil = await buscarPerfil(uid);
    import('./inicio.js').then((view) => navegar(view, { uid, perfil }));
  });
}
