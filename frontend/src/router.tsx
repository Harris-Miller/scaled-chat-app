import { Typography } from '@mui/material';
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AppWrapper } from './components/AppWrapper';
import { CharacterCreator } from './components/characterCreator/CharacterCreator';
import { Characters } from './components/Characters';
import { DbExplorer } from './components/dbExplorer/DbExplorer';
import { EncounterCreator } from './components/EncounterCreator';
import { Home } from './components/Home';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppWrapper>
        <Outlet />
      </AppWrapper>
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  component: Home,
  getParentRoute: () => rootRoute,
  path: '/',
});

const encounterCreatorRoute = createRoute({
  component: EncounterCreator,
  getParentRoute: () => rootRoute,
  path: '/encounter-creator',
});

const dbExplorerRoute = createRoute({
  component: DbExplorer,
  getParentRoute: () => rootRoute,
  path: '/db-explorer',
});

const charactersRoute = createRoute({
  component: Characters,
  getParentRoute: () => rootRoute,
  path: '/characters',
});

const characterCreatorRoute = createRoute({
  component: CharacterCreator,
  getParentRoute: () => rootRoute,
  path: '/characters/create',
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  encounterCreatorRoute,
  dbExplorerRoute,
  charactersRoute.addChildren([characterCreatorRoute]),
]);

const router = createRouter({
  defaultNotFoundComponent: () => <Typography>Not Found</Typography>,
  routeTree,
});

export { router };
