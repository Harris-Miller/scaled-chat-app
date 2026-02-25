import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

// import { getProfile } from '../api/user';
import { AppWrapper } from '../components/AppWrapper';
// import { store } from '../store';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <AppWrapper>
        <Outlet />
      </AppWrapper>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  ),
  // loader: () => {
  //   return getProfile()
  //     .then(resp => {
  //       store.getState().setUser(resp.data);
  //     })
  //     .catch((_resp: unknown) => {
  //       // TODO
  //     });
  // },
  staleTime: Infinity,
});
