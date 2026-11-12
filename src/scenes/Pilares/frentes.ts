// As 3 frentes oficiais e a tira de trabalhos (briefing v4, "A tira").
// Por ora todo trabalho é placeholder: o PO está levantando os projetos
// reais. Para ligar um trabalho de verdade basta preencher `midia` e
// trocar título, tipo e ano; o painel deixa de ser placeholder sozinho.

export type Frente = 'identidade' | 'digital' | 'tecnologia'

export type FrenteInfo = {
  readonly id: Frente
  readonly numero: string
  readonly nome: string
  readonly ancora: string
}

export type Midia = {
  readonly kind: 'image' | 'video'
  readonly src: string
  readonly poster?: string
  readonly alt: string
}

export type Trabalho = {
  readonly id: string
  readonly frente: Frente
  readonly titulo: string
  readonly tipo: string
  readonly ano: string
  readonly formato: 'paisagem' | 'retrato'
  readonly anotacao?: string
  readonly midia?: Midia
}

export const FRENTES: readonly FrenteInfo[] = [
  { id: 'identidade', numero: '01', nome: 'Identidade & Design', ancora: 'CARA.' },
  { id: 'digital', numero: '02', nome: 'Presença Digital', ancora: 'PALCO.' },
  { id: 'tecnologia', numero: '03', nome: 'Tecnologia & Automação', ancora: 'MOTOR.' },
]

export const TRABALHOS: readonly Trabalho[] = [
  {
    id: 'identidade-01',
    frente: 'identidade',
    titulo: 'Identidade 01',
    tipo: 'Identidade visual',
    ano: '2026',
    formato: 'paisagem',
    anotacao: 'o trabalho real entra aqui',
  },
  {
    id: 'identidade-02',
    frente: 'identidade',
    titulo: 'Identidade 02',
    tipo: 'Apparel',
    ano: '2025',
    formato: 'retrato',
  },
  {
    id: 'digital-01',
    frente: 'digital',
    titulo: 'Presença 01',
    tipo: 'Site',
    ano: '2026',
    formato: 'paisagem',
    anotacao: 'site rodando em vídeo',
  },
  {
    id: 'digital-02',
    frente: 'digital',
    titulo: 'Presença 02',
    tipo: 'Conteúdo e vídeo',
    ano: '2025',
    formato: 'retrato',
  },
  {
    id: 'tecnologia-01',
    frente: 'tecnologia',
    titulo: 'Motor 01',
    tipo: 'Automação',
    ano: '2026',
    formato: 'paisagem',
    anotacao: 'entrada vira saída',
  },
  {
    id: 'tecnologia-02',
    frente: 'tecnologia',
    titulo: 'Motor 02',
    tipo: 'Produto digital',
    ano: '2026',
    formato: 'paisagem',
  },
]

export type Painel =
  | { readonly kind: 'cartaz'; readonly id: 'cartaz' }
  | { readonly kind: 'capa'; readonly id: string; readonly frente: FrenteInfo }
  | {
      readonly kind: 'trabalho'
      readonly id: string
      readonly frente: FrenteInfo
      readonly trabalho: Trabalho
      readonly indice: number
      readonly ordem: string
    }
  | { readonly kind: 'fecho'; readonly id: 'fecho' }

/** A tira na ordem de leitura: cartaz, cada frente com capa e trabalhos, fecho. */
export function montarTira(
  frentes: readonly FrenteInfo[] = FRENTES,
  trabalhos: readonly Trabalho[] = TRABALHOS,
): Painel[] {
  const tira: Painel[] = [{ kind: 'cartaz', id: 'cartaz' }]
  let indice = 0
  for (const frente of frentes) {
    tira.push({ kind: 'capa', id: `capa-${frente.id}`, frente })
    trabalhos
      .filter((t) => t.frente === frente.id)
      .forEach((trabalho, i) => {
        tira.push({
          kind: 'trabalho',
          id: trabalho.id,
          frente,
          trabalho,
          indice,
          ordem: `${frente.numero}.${i + 1}`,
        })
        indice += 1
      })
  }
  tira.push({ kind: 'fecho', id: 'fecho' })
  return tira
}

export const TIRA = montarTira()
export const TOTAL_TRABALHOS = TIRA.filter((p) => p.kind === 'trabalho').length
