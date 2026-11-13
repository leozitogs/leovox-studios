// Cena 7 · Sobre · o conteúdo da folha de contato, da tese e do elenco.
// Fotos ainda são placeholders declarados (como na tira dos Pilares): um
// recorte do fundo do hero, já em halftone, até as fotos reais chegarem.
// Regra do briefing: só entra fato que prova "criativo e técnico ao mesmo
// tempo" e que o PO liberou como público; nada de número sem prova.

export type Fotograma = {
  /** recorte do placeholder (background-position do fundo do hero) */
  readonly recorte: string
  /** descrição pro leitor de tela, mesmo no placeholder */
  readonly alt: string
}

export type Tira = {
  readonly ano: string
  readonly codigo: string
  /** qual dos três fotogramas a mão circula */
  readonly escolhido: 0 | 1 | 2
  /** a anotação ao lado do círculo */
  readonly nota: string
  /** o que a tira prova, lido em ordem pelo leitor de tela */
  readonly prova: string
  readonly fotogramas: readonly [Fotograma, Fotograma, Fotograma]
}

const ph = (recorte: string, alt: string): Fotograma => ({ recorte, alt })

export const TIRAS: readonly Tira[] = [
  {
    ano: '2020',
    codigo: 'LEOVOX 400 · 2020 · 07A ▸ 08 ▸ 09',
    escolhido: 1,
    nota: 'O primeiro cliente',
    prova: 'Primeiras camisas e identidades, feitas como freelancer.',
    fotogramas: [
      ph('8% 62%', 'Placeholder de fotograma de 2020'),
      ph('30% 58%', 'Placeholder de fotograma de 2020, o take escolhido'),
      ph('52% 66%', 'Placeholder de fotograma de 2020'),
    ],
  },
  {
    ano: '2023',
    codigo: 'LEOVOX 400 · 2023 · 12A ▸ 13 ▸ 14',
    escolhido: 2,
    nota: 'Aprendi sozinho',
    prova: 'O primeiro código escrito sozinho e as primeiras automações.',
    fotogramas: [
      ph('70% 60%', 'Placeholder de fotograma de 2023'),
      ph('88% 64%', 'Placeholder de fotograma de 2023'),
      ph('96% 52%', 'Placeholder de fotograma de 2023, o take escolhido'),
    ],
  },
  {
    ano: '2025',
    codigo: 'LEOVOX 400 · 2025 · 21A ▸ 22 ▸ 23',
    escolhido: 0,
    nota: 'Aqui virou estúdio',
    prova: 'A entrada na universidade e o nascimento da identidade Leovox.',
    fotogramas: [
      ph('18% 80%', 'Placeholder de fotograma de 2025, o take escolhido'),
      ph('42% 84%', 'Placeholder de fotograma de 2025'),
      ph('64% 78%', 'Placeholder de fotograma de 2025'),
    ],
  },
]

/** As anotações da mão em volta do retrato, na ordem em que entram. */
export const SETAS_DO_RETRATO = ['Desenha desde 2020', 'Programa desde 2023', 'Engenharia de IA']

export type Prova = {
  readonly rotulo: string
  readonly numero: string
  /** a última prova do varal é um convite, não uma pessoa */
  readonly convite?: boolean
}

export const ELENCO: readonly Prova[] = [
  { rotulo: 'Fundador', numero: '01' },
  { rotulo: 'Elenco', numero: '02' },
  { rotulo: 'Você?', numero: '03', convite: true },
]

export const CREDITOS: readonly (readonly [string, string])[] = [
  ['Direção e código', 'Leonardo Sobral'],
  ['Estúdio', 'Leovox Studios'],
  ['Elenco', 'A definir'],
  ['Cidade', 'Recife, BR'],
]

/** O que corre nas fitas da borda: o filme e o set, não cargos. */
export const FITA_NEGATIVO = [
  'Cena 07',
  'Making-of',
  'Leovox 400',
  'Take 1',
  'Como a Leovox foi feita',
]
export const FITA_SET = ['Set de filmagem', 'Não ultrapasse', 'Equipe trabalhando']
