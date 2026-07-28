import './style.css';
import { garantirSessaoAnonima, buscarPerfil } from './auth.js';
import { navegar } from './utils/router.js';
import { mostrarToast } from './utils/toast.js';

async function iniciar() {
  document.getElementById('app').innerHTML = '<p class="carregando">Carregando...</p>';

  try {
    const usuario = await garantirSessaoAnonima();
    const perfil = await buscarPerfil(usuario.uid);

    if (perfil) {
      const view = await import('./views/inicio.js');
      navegar(view, { uid: usuario.uid, perfil });
    } else {
      const view = await import('./views/cadastro.js');
      navegar(view, { uid: usuario.uid });
    }
  } catch (erro) {
    console.error(erro);
    mostrarToast('Não deu pra conectar. Verifique sua internet e recarregue a página.', {
      erro: true,
      duracao: 6000,
    });
  }
}

iniciar();
