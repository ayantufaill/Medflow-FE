import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import allRoutes from './routes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {allRoutes}
    </Route>
  )
);

// Split App.jsx (1,937 lines) into 14 domain route files under src/routes/ plus a theme.js, 
// reducing App.jsx to 33 lines. Build passes. Next: continue form refactoring for remaining domains (rooms,   
// users, note templates, etc.). (disable recaps in /config)
function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
              <SnackbarProvider>
                <RouterProvider router={router} />
              </SnackbarProvider>
            </AuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
