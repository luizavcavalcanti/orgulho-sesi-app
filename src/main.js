import './style.css';
import { garantirSessaoAnonima, buscarPerfil } from './auth.js';
import { navegar } from './utils/router.js';
import { mostrarToast } from './utils/toast.js';

// Os QR codes do evento apontam para /scan?atividade=CODIGO. Isso faz a
// câmera nativa do celular abrir o app já sabendo qual dinâmica pontuar —
// caminho bem mais confiável, num evento com centenas de aparelhos
// diferentes, do que exigir que todo mundo use o leitor de dentro do app.
function codigoNaUrl() {
  const codigo = new URLSearchParams(window.location.search).get('atividade');
  if (!codigo) return null;
  // Tira o parâmetro da barra de endereço pra um F5 não repontuar.
  window.history.replaceState({}, '', window.location.pathname);
  return codigo;
}

async function iniciar() {
  document.getElementById('app').innerHTML = '<p class="carregando">Carregando...</p>';
  const codigo = codigoNaUrl();

  try {
    const usuario = await garantirSessaoAnonima();
    const perfil = await buscarPerfil(usuario.uid);

    if (!perfil) {
      const view = await import('./views/cadastro.js');
      navegar(view, { uid: usuario.uid, codigoPendente: codigo });
      return;
    }

    if (codigo) {
      const view = await import('./views/pontuar.js');
      navegar(view, { uid: usuario.uid, codigo });
      return;
    }

    const view = await import('./views/inicio.js');
    navegar(view, { uid: usuario.uid, perfil });
  } catch (erro) {
    console.error(erro);
    mostrarToast('Não deu pra conectar. Verifique sua internet e recarregue a página.', {
      erro: true,
      duracao: 6000,
    });
  }
}

iniciar();
