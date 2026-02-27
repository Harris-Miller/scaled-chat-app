import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

import { LoremIpsum } from '../../components/LoremIpsum';

export const RoomsIndexComponent: FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h2">Le Chat Rooms</Typography>
      <LoremIpsum />
    </Box>
  );
};

export const Route = createFileRoute('/rooms/')({
  component: RoomsIndexComponent,
});
