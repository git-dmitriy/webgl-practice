import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@14islands/r3f-scroll-rig/css'
import App from './App'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
