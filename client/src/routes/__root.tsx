import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AppWrapper } from '../components/AppWrapper';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppWrapper>
        <Outlet />
      </AppWrapper>
      <TanStackRouterDevtools />
    </>
  ),
});
