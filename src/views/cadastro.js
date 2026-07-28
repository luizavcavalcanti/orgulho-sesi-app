import { criarPerfil } from '../auth.js';
import { mostrarToast } from '../utils/toast.js';

export function render(raiz, { uid }, navegar) {
  raiz.innerHTML = `
    <div class="topo-marca">
      <img src="/logo-orgulho-sesi.png" alt="Orgulho de Ser Sesi" />
    </div>
    <div class="tela">
      <h1 class="tela-titulo">Bem-vindo!</h1>
      <p class="tela-subtitulo">vamos te conhecer</p>

      <form id="form-cadastro" class="cartao" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="campo">
          <label for="campo-nome">Nome</label>
          <input id="campo-nome" name="nome" type="text" autocomplete="given-name" required />
        </div>
        <div class="campo">
          <label for="campo-sobrenome">Sobrenome</label>
          <input id="campo-sobrenome" name="sobrenome" type="text" autocomplete="family-name" required />
        </div>
        <div class="campo">
          <label for="campo-matricula">3 primeiros números da matrícula</label>
          <input
            id="campo-matricula"
            name="matricula"
            type="text"
            inputmode="numeric"
            pattern="[0-9]{3}"
            maxlength="3"
            placeholder="ex: 042"
            required
          />
        </div>
        <button type="submit" class="botao botao-primario">Começar</button>
      </form>
    </div>
  `;

  const form = raiz.querySelector('#form-cadastro');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = form.querySelector('button');
    const dados = new FormData(form);
    const matricula = dados.get('matricula').trim();

    if (!/^\d{3}$/.test(matricula)) {
      mostrarToast('Digite os 3 primeiros números da matrícula.', { erro: true });
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Só um instante...';

    try {
      const perfil = await criarPerfil(uid, {
        nome: dados.get('nome'),
        sobrenome: dados.get('sobrenome'),
        matriculaParcial: matricula,
      });
      import('./inicio.js').then((view) => navegar(view, { uid, perfil }));
    } catch (erro) {
      console.error(erro);
      mostrarToast('Não deu pra salvar seu cadastro. Tenta de novo.', { erro: true });
      botao.disabled = false;
      botao.textContent = 'Começar';
    }
  });
}
