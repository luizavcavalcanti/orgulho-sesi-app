let timeoutAtivo = null;

export function mostrarToast(mensagem, { erro = false, duracao = 3000 } = {}) {
  document.querySelector('.toast')?.remove();
  clearTimeout(timeoutAtivo);

  const elemento = document.createElement('div');
  elemento.className = erro ? 'toast toast-erro' : 'toast';
  elemento.textContent = mensagem;
  document.body.appendChild(elemento);

  timeoutAtivo = setTimeout(() => elemento.remove(), duracao);
}
