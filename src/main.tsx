import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import { captureErrors } from './lib/errors'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'

// a captura entra antes de tudo: erro de boot tambem e explicitado
captureErrors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
