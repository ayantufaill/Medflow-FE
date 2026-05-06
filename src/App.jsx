import { BrowserRouter, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import theme from './theme';
import allRoutes from './routes';

function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <SnackbarProvider>
              <BrowserRouter>
                <Routes>
                  {allRoutes}
                </Routes>
              </BrowserRouter>
            </SnackbarProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
