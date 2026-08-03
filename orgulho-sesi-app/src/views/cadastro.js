import { criarPerfil } from '../auth.js';
import { hero } from '../utils/hero.js';
import { mostrarToast } from '../utils/toast.js';

export function render(raiz, { uid, codigoPendente = null }, navegar) {
  raiz.innerHTML = `
    ${hero({
      chapeu: 'Bem-vindo ao evento',
      titulo: 'Vamos te identificar',
      descricao: 'Só o seu nome e os 3 primeiros números da matrícula. Sem e-mail, sem senha.',
      comLogo: true,
    })}
    <div class="corpo">
      <form id="form-cadastro" class="cartao">
        <div class="campo">
          <label for="campo-nome">Nome</label>
          <input id="campo-nome" name="nome" type="text" autocomplete="given-name" required />
        </div>
        <div class="campo">
          <label for="campo-sobrenome">Sobrenome</label>
          <input id="campo-sobrenome" name="sobrenome" type="text" autocomplete="family-name" required />
        </div>
        <div class="campo">
          <label for="campo-matricula">3 primeiros da matrícula</label>
          <input
            id="campo-matricula"
            name="matricula"
            type="text"
            inputmode="numeric"
            pattern="[0-9]{3}"
            maxlength="3"
            placeholder="427"
            required
          />
        </div>
      </form>
      <button id="botao-entrar" class="botao">Entrar no evento</button>
    </div>
  `;

  const form = raiz.querySelector('#form-cadastro');
  const botao = raiz.querySelector('#botao-entrar');

  async function enviar() {
    const dados = new FormData(form);
    const nome = dados.get('nome').trim();
    const sobrenome = dados.get('sobrenome').trim();
    const matricula = dados.get('matricula').trim();

    if (!nome || !sobrenome) {
      mostrarToast('Preencha nome e sobrenome.', { erro: true });
      return;
    }
    if (!/^\d{3}$/.test(matricula)) {
      mostrarToast('Digite os 3 primeiros números da matrícula.', { erro: true });
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Só um instante...';

    try {
      const perfil = await criarPerfil(uid, { nome, sobrenome, matriculaParcial: matricula });
      if (codigoPendente) {
        const view = await import('./pontuar.js');
        navegar(view, { uid, codigo: codigoPendente });
        return;
      }
      const view = await import('./inicio.js');
      navegar(view, { uid, perfil });
    } catch (erro) {
      console.error(erro);
      mostrarToast('Não deu pra salvar seu cadastro. Tenta de novo.', { erro: true });
      botao.disabled = false;
      botao.textContent = 'Entrar no evento';
    }
  }

  botao.addEventListener('click', enviar);
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    enviar();
  });
}
