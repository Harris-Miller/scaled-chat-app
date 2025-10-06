import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

import './globals.css';

import { queryClient } from './api/queryClient';
import { ThemeWrapper } from './components/ThemeWrapper';
import { routeTree } from './routeTree.gen';

import { Container, Flex, Section, Spinner } from '@radix-ui/themes';

// Create a new router instance
const router = createRouter({
  context: { queryClient },
  defaultPendingComponent: () => (
    <Container>
      <Section>
        <Flex justify="center">
          <Spinner />
          Loading...
          <Spinner />
        </Flex>
      </Section>
    </Container>
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <ThemeWrapper>
    {/* <CssBaseline /> */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </ThemeWrapper>,
);
