import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Fira Code', monospace",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FF5533",
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#FF5533"
          }
        }
      }
    },
     MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#FF5533',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#FF2A00'
          }
        }
      }
    }
  }
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
