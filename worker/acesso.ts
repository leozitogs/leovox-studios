// Portão do site enquanto ele roda fechado (HTTP Basic). Função pura,
// testada em tests/acesso.test.ts. A senha nunca está no código: chega
// como segredo do Worker (PREVIEW_PASSWORD), cadastrado pelo PO.

const encoder = new TextEncoder()

async function resumo(texto: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(texto)))
}

// Compara os resumos byte a byte sem sair cedo: o tempo de resposta não
// revela quantos caracteres da senha estavam certos.
async function iguais(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([resumo(a), resumo(b)])
  let diferenca = 0
  for (let i = 0; i < x.length; i += 1) diferenca |= x[i] ^ y[i]
  return diferenca === 0
}

/** Lê usuário e senha de um cabeçalho Authorization: Basic. */
export function credenciais(cabecalho: string | null): { usuario: string; senha: string } | null {
  if (!cabecalho) return null
  const [esquema, valor] = cabecalho.split(' ')
  if (esquema?.toLowerCase() !== 'basic' || !valor) return null
  let decodificado: string
  try {
    const bytes = Uint8Array.from(atob(valor), (c) => c.charCodeAt(0))
    decodificado = new TextDecoder().decode(bytes)
  } catch {
    return null
  }
  const corte = decodificado.indexOf(':')
  if (corte < 0) return null
  return { usuario: decodificado.slice(0, corte), senha: decodificado.slice(corte + 1) }
}

/**
 * O pedido pode passar? Sem senha configurada, ninguém passa: o site
 * falha fechado em vez de abrir por esquecimento.
 */
export async function autorizado(
  cabecalho: string | null,
  usuarioCerto: string | undefined,
  senhaCerta: string | undefined,
): Promise<boolean> {
  if (!senhaCerta || !usuarioCerto) return false
  const dados = credenciais(cabecalho)
  if (!dados) return false
  const [usuarioOk, senhaOk] = await Promise.all([
    iguais(dados.usuario, usuarioCerto),
    iguais(dados.senha, senhaCerta),
  ])
  return usuarioOk && senhaOk
}
