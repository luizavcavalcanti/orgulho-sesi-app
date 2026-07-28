import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase.js';
import { buscarAtividade } from './activities.js';

export class AtividadeInvalidaError extends Error {}
export class AtividadeRepetidaError extends Error {}

// O QR code só carrega o id da atividade, nunca a pontuação — se os pontos
// estivessem no código, bastaria imprimir um QR falso valendo 9999. A regra
// de "não pode pontuar duas vezes na mesma atividade" também vive aqui,
// dentro da transação, pra não dar corrida entre dois scans quase juntos.
export async function pontuarAtividade(uid, atividadeId) {
  const atividade = buscarAtividade(atividadeId);
  if (!atividade) {
    throw new AtividadeInvalidaError(`QR code não corresponde a nenhuma atividade conhecida: ${atividadeId}`);
  }

  const ref = doc(db, 'participantes', uid);

  const resultado = await runTransaction(db, async (transacao) => {
    const snap = await transacao.get(ref);
    if (!snap.exists()) {
      throw new Error('Perfil do participante não encontrado.');
    }

    const dados = snap.data();
    const jaFeitas = dados.atividadesConcluidas ?? [];

    if (jaFeitas.includes(atividadeId)) {
      throw new AtividadeRepetidaError(atividade.nome);
    }

    const pontosAtualizados = (dados.pontos ?? 0) + atividade.pontos;
    transacao.update(ref, {
      pontos: pontosAtualizados,
      atividadesConcluidas: [...jaFeitas, atividadeId],
    });

    return { atividade, pontosAtualizados };
  });

  return resultado;
}
