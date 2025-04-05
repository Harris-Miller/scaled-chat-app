import { CssBaseline } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeWrapper } from './components/ThemeWrapper.tsx';
import { router } from './router.tsx';

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeWrapper>
  </React.StrictMode>,
);
