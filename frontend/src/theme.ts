import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fd5c63',
    },
    background: {
      default: '#fef9f9',
    },
    text: {
      primary: '#222',
    },
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif",
  },
});

export default theme;
