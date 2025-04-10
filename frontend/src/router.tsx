import { Typography } from '@mui/material';
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AppWrapper } from './components/AppWrapper';
import { Campaigns } from './components/Campaigns/Campaigns';
import { Encounters } from './components/Campaigns/Encounters/Encounters';
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

const campaignsRoute = createRoute({
  component: Campaigns,
  getParentRoute: () => rootRoute,
  path: '/campaigns',
});

const campaignRoute = createRoute({
  component: EncounterCreator,
  getParentRoute: () => rootRoute,
  path: '/campaigns/$campaignId',
});

const encountersRoute = createRoute({
  component: Encounters,
  getParentRoute: () => rootRoute,
  path: '/campaigns/$campaignId/encounters',
});

const encounterRoute = createRoute({
  component: EncounterCreator,
  getParentRoute: () => rootRoute,
  path: '/campaigns/$campaignId/encounters/$encounterId',
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
  campaignsRoute,
  campaignRoute,
  encountersRoute,
  encounterRoute,
  dbExplorerRoute,
  charactersRoute.addChildren([characterCreatorRoute]),
]);

const router = createRouter({
  defaultNotFoundComponent: () => <Typography>Not Found</Typography>,
  routeTree,
});

export { router };
