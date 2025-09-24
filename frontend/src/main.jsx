import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalStyles from '../components/GlobalStyles/GlobalStyles.jsx'
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyles>
      <App />
      </GlobalStyles>
  </StrictMode>,
)
