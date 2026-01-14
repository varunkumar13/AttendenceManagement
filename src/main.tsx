import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App"
import Navigation from './Navigation/navigation'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
   <Navigation />
   </BrowserRouter>
  </StrictMode>,
)
 