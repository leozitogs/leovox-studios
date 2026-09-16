// As 3 frentes oficiais da Leovox (briefing da cena 3, item travado).
// O tipo fechado aqui encerra a pendencia aberta desde a decisao 8.
// As palavras-ancora sao os placeholders aprovados pra build: o
// martelo final e do PO antes do PR.

export type Frente = 'identidade' | 'digital' | 'tecnologia'

export type FrenteInfo = {
  readonly id: Frente
  readonly numero: string
  readonly nome: string
  readonly ancora: string
  readonly complemento?: string
}

export const FRENTES: readonly FrenteInfo[] = [
  { id: 'identidade', numero: '01', nome: 'Identidade & Design', ancora: 'CARA.' },
  {
    id: 'digital',
    numero: '02',
    nome: 'Presença Digital',
    ancora: 'PALCO.',
    complemento: 'Conteúdo & vídeo',
  },
  { id: 'tecnologia', numero: '03', nome: 'Tecnologia & Automação', ancora: 'MOTOR.' },
]
