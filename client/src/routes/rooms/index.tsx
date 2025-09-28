import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

export const RoomsIndexComponent: FC = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Box>Le Chat Rooms</Box>
    </Box>
  );
};

export const Route = createFileRoute('/rooms/')({
  component: RoomsIndexComponent,
});
