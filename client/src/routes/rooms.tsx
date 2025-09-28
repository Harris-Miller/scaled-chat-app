import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { Sidebar } from '../components/Sidebar';

export const RoomsLayout: FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
