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
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider noSsr theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>,
);
