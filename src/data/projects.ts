// Fonte de dados do Selected Projects (cena 4) e do Case Index (cena 5).
// As 3 frentes oficiais são definidas no briefing da cena Pilares.

export type Frente = 'identidade' | 'digital' | 'tecnologia'

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
