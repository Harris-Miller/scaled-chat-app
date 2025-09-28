import { Box } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { Sidebar } from '../components/Sidebar';

export const RoomsLayout: FC = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Outlet />
    </Box>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
