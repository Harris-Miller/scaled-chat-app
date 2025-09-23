import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AppWrapper } from '../components/AppWrapper';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <AppWrapper>
        <Outlet />
      </AppWrapper>
      <TanStackRouterDevtools />
    </>
  ),
});
