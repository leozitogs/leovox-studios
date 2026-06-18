// Entry da cena 404, independente da home: sem Lenis, sem cenas,
// carrega instantaneo. A hospedagem serve o 404.html em qualquer
// URL quebrada.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import '../styles/global.css'
import { captureErrors } from '../lib/errors'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { NotFound } from './NotFound'

captureErrors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <NotFound />
    </ErrorBoundary>
  </StrictMode>,
)
