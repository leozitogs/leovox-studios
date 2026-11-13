// Frontmatter plano (chave: valor), sem dependência de YAML.
// Serve para specs, papéis e skills: tudo que o harness precisa ler é uma
// linha por chave. Listas e objetos aninhados não entram aqui de propósito.

export function normalizar(texto) {
  return texto.replace(/^﻿/, '').replace(/\r\n/g, '\n')
}

export function lerFrontmatter(texto) {
  const fonte = normalizar(texto)
  const bloco = fonte.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!bloco) return { dados: {}, corpo: fonte, temFrontmatter: false }
  const dados = {}
  for (const linha of bloco[1].split('\n')) {
    if (!linha.trim() || linha.trimStart().startsWith('#')) continue
    const par = linha.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!par) throw new Error(`frontmatter inválido: "${linha}"`)
    let valor = par[2].trim()
    if (/^(['"]).*\1$/.test(valor)) valor = valor.slice(1, -1)
    dados[par[1]] = valor === '' || valor === 'null' ? null : valor
  }
  return { dados, corpo: fonte.slice(bloco[0].length), temFrontmatter: true }
}

export function escreverFrontmatter(dados, corpo) {
  const linhas = Object.entries(dados).map(([chave, valor]) => `${chave}: ${valor ?? 'null'}`)
  return `---\n${linhas.join('\n')}\n---\n${corpo}`
}
