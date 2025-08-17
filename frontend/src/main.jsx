import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import './index.css'
import App from './App.jsx'
import theme from './theme/index.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Configure Theme*/}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
