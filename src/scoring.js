import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase.js';
import { lerCodigo, buscarAtividade } from './activities.js';

export class CodigoInvalidoError extends Error {}
export class AtividadeRepetidaError extends Error {}

// O QR carrega só o código da dinâmica, nunca a pontuação — se os pontos
// estivessem embutidos, bastaria imprimir um QR falso valendo 9999. Quem
// decide quanto vale é esta tabela, espelhada nas regras do Firestore.
//
// A trava de "não pode pontuar duas vezes" também vive aqui, dentro da
// transação, pra não dar corrida entre dois scans quase simultâneos.
export async function pontuarCodigo(uid, codigo) {
  const entrada = lerCodigo(codigo);
  if (!entrada) {
    throw new CodigoInvalidoError(codigo);
  }

  const atividade = buscarAtividade(entrada.atividade);
  const ref = doc(db, 'participantes', uid);

  return runTransaction(db, async (transacao) => {
    const snap = await transacao.get(ref);
    if (!snap.exists()) {
      throw new Error('Perfil do participante não encontrado.');
    }

    const dados = snap.data();
    const jaFeitas = dados.atividadesConcluidas ?? [];

    if (jaFeitas.includes(entrada.atividade)) {
      throw new AtividadeRepetidaError(atividade.nome);
    }

    const pontosAtualizados = (dados.pontos ?? 0) + entrada.pontos;
    transacao.update(ref, {
      pontos: pontosAtualizados,
      atividadesConcluidas: [...jaFeitas, entrada.atividade],
    });

    return { atividade, pontosGanhos: entrada.pontos, pontosAtualizados };
  });
}
