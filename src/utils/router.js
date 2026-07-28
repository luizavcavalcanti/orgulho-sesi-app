const raiz = document.getElementById('app');

let telaAtual = null;

// Cada view exporta uma função render(raiz, params, navegar) e,
// opcionalmente, uma função destruir() pra soltar recursos (câmera, listeners).
export function navegar(view, params = {}) {
  if (telaAtual?.destruir) {
    telaAtual.destruir();
  }

  raiz.innerHTML = '';
  telaAtual = view;
  view.render(raiz, params, navegar);
}
