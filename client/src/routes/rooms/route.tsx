import { Box, Drawer, Toolbar } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { Encapsulate } from '../../components/Encapsulate';
import { Header } from '../../components/Header';

import { SideBar } from './-sideBar';
import { TabRail } from './-tabRail';

const drawerWidth = 375;

export const RoomsLayout: FC = () => {
  return (
    <>
      <Header />
      <Drawer
        sx={{
          [`& .MuiDrawer-paper`]: { boxSizing: 'border-box', width: drawerWidth },
          flexShrink: 0,
          width: drawerWidth,
        }}
        variant="permanent"
      >
        <Toolbar />
        <Encapsulate sx={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          <TabRail />
          <SideBar />
        </Encapsulate>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden', padding: 0 }}>
        <Toolbar />
        <Encapsulate>
          <Outlet />
        </Encapsulate>
      </Box>
    </>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
