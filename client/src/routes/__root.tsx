import { Box } from '@mui/material';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { getProfile } from '../api/user';
import { AppWrapper } from '../components/AppWrapper';
import { store } from '../store';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <Box sx={{ bottom: 0, display: 'flex', left: 0, position: 'absolute', right: 0, top: 0 }}>
      <AppWrapper>
        <Outlet />
      </AppWrapper>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </Box>
  ),
  loader: () => {
    return getProfile()
      .then(resp => {
        store.getState().setUser(resp.data);
      })
      .catch((_resp: unknown) => {
        // TODO
      });
  },
  staleTime: Infinity,
});
