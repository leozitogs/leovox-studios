import type { FrenteInfo } from '../frentes'

export function ProjectIntro({ frente }: { frente: FrenteInfo }) {
  return (
    <header className="pl-project-intro" data-reveal="intro">
      <p className="pl-project-index">
        <span>{frente.numero}</span>
        <span className="pl-q-frente">{frente.nome}</span>
      </p>
      <h3 className="pl-project-title">{frente.projeto}</h3>
      <p className="pl-project-category">{frente.categoria}</p>
      <p className="pl-project-summary">{frente.resumo}</p>
    </header>
  )
}
