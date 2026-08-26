import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@zendesk-ui/react-components'
import './index.css'
import App from './App'

// @zendesk-ui/navigation uses element.ref which is deprecated in React 19.
// These warnings come from the package internals and cannot be fixed here.
const originalError = console.error
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('element.ref was removed')) return
  originalError(...args)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
