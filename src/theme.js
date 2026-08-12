import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2362EF',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#cbd5e1',
          '&.Mui-checked': {
            color: '#2362EF',
          },
          '&.MuiCheckbox-indeterminate': {
            color: '#2362EF',
          },
        },
      },
    },
  },
});

export default theme;
