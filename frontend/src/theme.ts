import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b5f52',
      dark: '#074038',
      light: '#1a7d6c',
      contrastText: '#f4fbf8',
    },
    secondary: {
      main: '#c45c26',
      contrastText: '#fff8f3',
    },
    background: {
      default: '#eef4f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#102820',
      secondary: '#4a635b',
    },
    success: { main: '#1b7a4a' },
    warning: { main: '#b86a00' },
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: 'none' },
        contained: {
          '&:hover': { boxShadow: '0 8px 20px rgba(11, 95, 82, 0.22)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(11, 95, 82, 0.08)',
          boxShadow: '0 10px 30px rgba(16, 40, 32, 0.06)',
        },
      },
    },
  },
})

export default theme
