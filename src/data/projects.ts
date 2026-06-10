// Fonte de dados do Selected Projects (cena 4) e do Case Index (cena 5).
// As 4 frentes serão nomeadas no briefing da cena Pilares;
// por ora o tipo fica aberto de propósito.

export type Frente = string

export interface Project {
  slug: string
  title: string
  frente: Frente
  year: number
  /** Entra no recorte curado do Selected Projects (3 a 4 trabalhos) */
  highlight?: boolean
  /** Faixa de resultado em destaque no Case Study */
  result?: string
}

export const projects: Project[] = []
