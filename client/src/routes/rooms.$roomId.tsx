/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

import { useRoom } from '../api/rooms';

export const RoomComponent: FC = () => {
  const { roomId } = Route.useParams();

  const query = useRoom(roomId);

  return (
    <Box alignContent="center" display="flex" justifyContent="center">
      <Box>
        <Typography>Room: {roomId}</Typography>
      </Box>
      <Box>
        <Typography>Name: {query.data?.data.name}</Typography>
      </Box>
    </Box>
  );
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
  params: {
    parse: params => ({
      roomId: Number.parseInt(params.roomId, 10),
    }),
  },
});
