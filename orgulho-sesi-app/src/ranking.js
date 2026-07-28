import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';

// Usado tanto na tela de ranking dentro do app quanto na TV — ambos só
// escutam essa mesma query, o Firestore empurra a atualização sozinho.
export function escutarRanking(quantidade, aoAtualizar) {
  const q = query(
    collection(db, 'participantes'),
    orderBy('pontos', 'desc'),
    limit(quantidade)
  );

  return onSnapshot(q, (snapshot) => {
    const posicoes = snapshot.docs.map((docSnap, indice) => ({
      posicao: indice + 1,
      uid: docSnap.id,
      ...docSnap.data(),
    }));
    aoAtualizar(posicoes);
  });
}

// A colocação exibida na home é só informativa, então busca uma vez em vez
// de manter um listener aberto. Limitado ao topo da tabela: quem está fora
// dele não vê número de posição, o que evita puxar centenas de documentos
// num evento com mais de 500 participantes.
const TETO_POSICAO = 100;

export async function posicaoDoParticipante(uid) {
  const q = query(
    collection(db, 'participantes'),
    orderBy('pontos', 'desc'),
    limit(TETO_POSICAO)
  );
  const snapshot = await getDocs(q);
  const indice = snapshot.docs.findIndex((docSnap) => docSnap.id === uid);
  return indice === -1 ? null : indice + 1;
}
