// A borda de papel rasgado das capas e do fecho, como clip-path.
// Determinística por semente: o mesmo painel rasga sempre igual, no
// servidor de testes e no navegador. Só a borda esquerda rasga; as
// outras três são corte reto de guilhotina.

function gerador(semente: number): () => number {
  let estado = semente >>> 0 || 1
  return () => {
    // LCG clássico (Numerical Recipes): suficiente para irregularidade visual
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0
    return estado / 4294967296
  }
}

/**
 * Polígono com a borda esquerda rasgada. `profundidade` é o quanto o
 * rasgo entra no papel, em % da largura.
 */
export function rasgo(semente: number, dentes = 34, profundidade = 2.4): string {
  const aleatorio = gerador(semente)
  const pontos: string[] = ['100% 0%', '100% 100%']
  for (let i = dentes; i >= 0; i -= 1) {
    const y = (i / dentes) * 100
    // fibra: entradas grandes raras, pequenas frequentes
    const fundo = aleatorio() < 0.18 ? 1 : 0.45
    const x = aleatorio() * profundidade * fundo
    pontos.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  }
  return `polygon(${pontos.join(', ')})`
}
