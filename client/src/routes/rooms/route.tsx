import { Flex } from '@radix-ui/themes';
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
      <Flex className="rooms-container">
        <Flex width="440px">
          <TabRail />
          <Sidebar />
        </Flex>
        <Flex className="main" flexGrow="1" p="3">
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
