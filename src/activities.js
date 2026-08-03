// Cada QR code do evento carrega um "código". A maior parte das dinâmicas
// tem um código só; três variam a pontuação: o jogo interativo (desempenho
// da equipe), o armário (face do dado) e o quiz (colocação).
//
// Todos os códigos de uma mesma dinâmica gravam a MESMA atividade no
// perfil — é isso que impede alguém de escanear as seis faces do dado e
// somar tudo: a segunda tentativa cai na trava de atividade repetida.

export const ATIVIDADES = [
  { id: 'jogo-interativo', nome: 'Jogo Solução na Casa da Indústria', resumo: 'até 20 pontos' },
  { id: 'armario', nome: 'Armário Premiado', resumo: '5 a 30 pontos, conforme o dado' },
  { id: 'oficina-cultura', nome: 'Oficina de Cultura', resumo: '20 pontos' },
  { id: 'quiz', nome: 'Quiz', resumo: '10 a 20 pontos, conforme a colocação' },
  { id: 'oficina-saude-1', nome: 'Oficina de Saúde 1', resumo: '15 pontos' },
  { id: 'oficina-saude-2', nome: 'Oficina de Saúde 2', resumo: '15 pontos' },
  { id: 'oficina-eja', nome: 'Oficina EJA', resumo: '15 pontos' },
  { id: 'oficina-areas', nome: 'Oficina Áreas de Conhecimento', resumo: '15 pontos' },
  { id: 'oficina-aee', nome: 'Oficina AEE', resumo: '15 pontos' },
];

// O jogo soma peça a peça (4 por acerto, +3 por fechar as três camadas,
// +5 por fechar no tempo, mínimo 3, teto 20), o que produz exatamente estes
// nove resultados. A tela final do jogo exibe o QR correspondente.
const PONTUACOES_DO_JOGO = [3, 4, 7, 8, 11, 12, 15, 16, 20];

// código do QR -> qual atividade ele marca e quantos pontos vale
export const CODIGOS = {
  ...Object.fromEntries(
    PONTUACOES_DO_JOGO.map((pontos) => [`jogo-${pontos}`, { atividade: 'jogo-interativo', pontos }])
  ),

  'armario-1': { atividade: 'armario', pontos: 5 },
  'armario-2': { atividade: 'armario', pontos: 10 },
  'armario-3': { atividade: 'armario', pontos: 15 },
  'armario-4': { atividade: 'armario', pontos: 20 },
  'armario-5': { atividade: 'armario', pontos: 25 },
  'armario-6': { atividade: 'armario', pontos: 30 },

  'quiz-1-lugar': { atividade: 'quiz', pontos: 20 },
  'quiz-2-lugar': { atividade: 'quiz', pontos: 15 },
  'quiz-3-lugar': { atividade: 'quiz', pontos: 15 },
  'quiz-participacao': { atividade: 'quiz', pontos: 10 },

  'oficina-cultura': { atividade: 'oficina-cultura', pontos: 20 },
  'oficina-saude-1': { atividade: 'oficina-saude-1', pontos: 15 },
  'oficina-saude-2': { atividade: 'oficina-saude-2', pontos: 15 },
  'oficina-eja': { atividade: 'oficina-eja', pontos: 15 },
  'oficina-areas': { atividade: 'oficina-areas', pontos: 15 },
  'oficina-aee': { atividade: 'oficina-aee', pontos: 15 },
};

export function lerCodigo(codigo) {
  return CODIGOS[codigo] ?? null;
}

export function buscarAtividade(id) {
  return ATIVIDADES.find((a) => a.id === id) ?? null;
}
