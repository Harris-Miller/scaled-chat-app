import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { Header } from '../../components/Header';

import './route.css';

export const RoomsLayout: FC = () => {
  return (
    <>
      {/* <div className="background" /> */}
      <Header />
      {/* <Flex className="rooms-container">
        <Flex width="440px">
          <TabRail />
          <Sidebar />
        </Flex>
        <Flex className="main" flexGrow="1" p="3">
          <Outlet />
        </Flex>
      </Flex> */}
    </>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
