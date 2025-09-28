/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import type { FC, SyntheticEvent } from 'react';

import { queryClient } from '../../../api/queryClient';
import { getRoomByIdOptions } from '../../../api/rooms';

const RoomComponent: FC = () => {
  const { roomId } = Route.useParams();
  const {
    data: { description, name },
  } = useSuspenseQuery(getRoomByIdOptions(roomId));
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);

  const tabValue = location.pathname.endsWith('canvas') ? 1 : 0;

  const handleTab = (_e: SyntheticEvent, tabId: number) => {
    switch (tabId) {
      case 0: {
        navigate({ params: { roomId }, to: '/rooms/$roomId' });
        break;
      }
      case 1: {
        navigate({ params: { roomId }, to: '/rooms/$roomId/canvas' });
        break;
      }
      default: {
        // do nothing
      }
    }
  };

  return (
    <Box
      data-id="SubComponent"
      display="flex"
      flexDirection="column"
      // 64px is height of Header
      sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}
    >
      <Box>
        <Typography>
          {name} - {description}
        </Typography>
      </Box>
      <Tabs onChange={handleTab} value={tabValue}>
        <Tab label="Messages" />
        <Tab label="Canvas" />
      </Tabs>
      <Outlet />
    </Box>
  );
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
  errorComponent: () => (
    <Box alignContent="center" display="flex" justifyContent="center" overflow="hidden">
      <Typography>There was an error loading the room</Typography>
    </Box>
  ),
  loader: ({ params: { roomId } }) => queryClient.prefetchQuery(getRoomByIdOptions(roomId)),
  pendingComponent: () => (
    <Box alignContent="center" display="flex" justifyContent="center">
      <Typography>Loading Room...</Typography>
    </Box>
  ),
});
