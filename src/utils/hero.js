// Topo azul repetido em todas as telas: chevrons, chapéu, título e (só na
// primeira tela) o logo do evento.
export function hero({ chapeu, titulo, descricao = '', comLogo = false }) {
  return `
    <div class="hero">
      <div class="chevrons">›››</div>
      ${comLogo ? '<img class="logo" src="/logo-orgulho-sesi.png" alt="Orgulho de Ser Sesi" />' : ''}
      <span class="chapeu">${chapeu}</span>
      <h1>${titulo}</h1>
      ${descricao ? `<p>${descricao}</p>` : ''}
    </div>
  `;
}
