import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from "react-redux";
import { store } from "./Redux/store.js";

const theme = createTheme({
  typography: {
    fontFamily: "'Fira Code', monospace",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderImageSlice: 1,
            borderWidth: "2px",
            borderImageSource: "linear-gradient(to bottom, #db2777, #ef4444, #f97316)",
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            background: "linear-gradient(to bottom, #db2777, #ef4444, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: "linear-gradient(to bottom, #db2777, #ef4444, #f97316)",
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
          '&:hover': {
            background: "linear-gradient(to right, #374151, #f43f5e, #fb923c)"
          }
        }
      }
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#f25138",
          '&.Mui-checked': {
            color: "#f25138", // fallback solid
            '& svg': {
              fill: "#f25138",
            },
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#f25138",
          '&.Mui-checked': {
            color: "#f25138",
            '& svg': {
              fill: "#f25138",
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#f25138',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            // backgroundImage: 'linear-gradient(to right, #db2777, #ef4444, #f97316)',
            backgroundColor: "#fda4af",
            border: "3px solid #fda4af",
            opacity: 1,
          },
        },
        track: {
          backgroundColor: '#ccc',
          opacity: 1,
        }
      }
    }


  },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
