/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import type { FC } from 'react';

import { queryClient } from '../../../api/queryClient';
import { getRoomByIdOptions } from '../../../api/rooms';

import './rooms.css';

const RoomComponent: FC = () => {
  const { roomId } = Route.useParams();
  const {
    data: { description, name },
  } = useSuspenseQuery(getRoomByIdOptions(roomId));

  const [tab, setTab] = useState<'canvas' | 'messages'>('messages');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Typography component="div">
        {name} - {description}
      </Typography>
      <Tabs
        onChange={(_, newValue: 'canvas' | 'messages') => {
          setTab(newValue);
        }}
        value={tab}
      >
        <Tab label="Messages" value="messages" />
        <Tab label="Canvas" value="canvas" />
      </Tabs>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
  errorComponent: () => (
    <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <Typography>There was an error loading the room</Typography>
    </Box>
  ),
  loader: ({ params: { roomId } }) => queryClient.prefetchQuery(getRoomByIdOptions(roomId)),
  pendingComponent: () => (
    <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <Typography>Loading Room...</Typography>
    </Box>
  ),
});
