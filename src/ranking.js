import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
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
