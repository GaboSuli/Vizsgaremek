import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Foldal from './components/Foldal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Foldal />
  </StrictMode>,
)
