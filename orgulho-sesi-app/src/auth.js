import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase.js';

// O Firebase gera um crachá anônimo por aparelho assim que a pessoa abre
// o app. Isso não pede e-mail nem senha — só serve pra amarrar a pontuação
// dela a um identificador que as regras do Firestore conseguem validar.
export function garantirSessaoAnonima() {
  return new Promise((resolve, reject) => {
    const cancelar = onAuthStateChanged(
      auth,
      (usuario) => {
        cancelar();
        if (usuario) {
          resolve(usuario);
          return;
        }
        signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(reject);
      },
      reject
    );
  });
}

export async function buscarPerfil(uid) {
  const ref = doc(db, 'participantes', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Identificação leve: nome + sobrenome + os 3 primeiros dígitos da matrícula.
// Não é login de verdade (quem autentica é o Firebase Anônimo por trás),
// isso aqui é só o que aparece pro participante e no ranking.
export async function criarPerfil(uid, { nome, sobrenome, matriculaParcial }) {
  const ref = doc(db, 'participantes', uid);
  const dados = {
    nome: nome.trim(),
    sobrenome: sobrenome.trim(),
    matriculaParcial: matriculaParcial.trim(),
    pontos: 0,
    atividadesConcluidas: [],
    criadoEm: serverTimestamp(),
  };
  await setDoc(ref, dados);
  return dados;
}

export function nomeExibicao(perfil) {
  if (!perfil) return '';
  return `${perfil.nome} ${perfil.sobrenome}`.trim();
}
