// Se algo explodir na arvore do React, em vez de tela branca o site
// mostra um corte na voz da marca, com caminho obvio de volta.

import { Component, type ErrorInfo, type ReactNode } from 'react'
import './errorboundary.css'

interface Props {
  children: ReactNode
}

interface State {
  broke: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { broke: false }

  static getDerivedStateFromError(): State {
    return { broke: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // o console.error ja esta plugado no barramento de erros
    console.error('ErrorBoundary:', error.message, info.componentStack ?? '')
  }

  render() {
    if (!this.state.broke) return this.props.children

    return (
      <div className="error-corte" role="alert">
        <p className="error-corte-titulo">CORTA.</p>
        <p className="error-corte-texto">Algo saiu do roteiro nesta cena.</p>
        <button className="error-corte-botao" onClick={() => window.location.reload()}>
          Recarregar a cena
        </button>
      </div>
    )
  }
}
