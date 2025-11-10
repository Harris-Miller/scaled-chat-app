import { Box, Flex } from '@radix-ui/themes';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { Sidebar } from '../../components/Sidebar';
import { TabRail } from '../../components/TabRail';
import { Toolbar } from '../../components/Toolbar';

import './route.css';

export const RoomsLayout: FC = () => {
  return (
    <>
      <div className="background" />
      <Toolbar />
      <Flex className="main-body">
        <Flex width="440px">
          <TabRail />
          <Sidebar />
        </Flex>
        <Box flexGrow="1">
          <Outlet />
        </Box>
      </Flex>
    </>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
