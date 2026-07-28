// Lista provisória. Cada atividade do evento vai gerar um QR code cujo
// conteúdo é só o `id` abaixo (ex: "https://.../scan?atividade=oficina-robotica").
// Trocar por essa lista definitiva assim que a organização fechar.
export const ATIVIDADES = [
  { id: 'oficina-robotica', nome: 'Oficina de Robótica', pontos: 20 },
  { id: 'trilha-seguranca', nome: 'Trilha de Segurança do Trabalho', pontos: 15 },
  { id: 'espaco-maker', nome: 'Espaço Maker', pontos: 20 },
  { id: 'mostra-projetos', nome: 'Mostra de Projetos Escolares', pontos: 15 },
  { id: 'jogo-casa-industria', nome: 'Jogo Solução na Casa da Indústria', pontos: 25 },
  { id: 'roda-conversa', nome: 'Roda de Conversa Pertencimento', pontos: 15 },
];

export function buscarAtividade(id) {
  return ATIVIDADES.find((a) => a.id === id) ?? null;
}
