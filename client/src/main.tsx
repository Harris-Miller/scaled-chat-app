import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

// TODO
import './instrumentation';
import './globals.css';

import { queryClient } from './api/queryClient';
import { FullScreenCenter } from './components/FullScreenCenter';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({
  context: { queryClient },
  defaultPendingComponent: () => (
    <FullScreenCenter>
      <CircularProgress />
    </FullScreenCenter>
  ),
  defaultPendingMinMs: 500,
  defaultPendingMs: 10,
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 400,
      letterSpacing: '0em',
      lineHeight: 1.167,
    },
    h2: {
      fontSize: '2.125rem',
      fontWeight: 400,
      letterSpacing: '0.00735em',
      lineHeight: 1.235,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0em',
      lineHeight: 1.334,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
      lineHeight: 1.6,
    },
    h5: undefined,
    h6: undefined,
  },
  zIndex: {
    // `appBar: 1100` by default, but for clipping the left drawer under the appBar, this needs to be above `drawer: 1200`
    appBar: 1250,
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider noSsr theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>,
);
