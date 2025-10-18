/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Flex, Tabs, Text } from '@radix-ui/themes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import type { FC } from 'react';

import { queryClient } from '../../../api/queryClient';
import { getRoomByIdOptions } from '../../../api/rooms';

const RoomComponent: FC = () => {
  const { roomId } = Route.useParams();
  const {
    data: { description, name },
  } = useSuspenseQuery(getRoomByIdOptions(roomId));
  const location = useLocation();
  // const navigate = useNavigate();

  console.log(location);

  // const tabValue = location.pathname.endsWith('canvas') ? 1 : 0;

  // const handleTab = (_e: SyntheticEvent, tabId: number) => {
  //   switch (tabId) {
  //     case 0: {
  //       navigate({ params: { roomId }, to: '/rooms/$roomId' });
  //       break;
  //     }
  //     case 1: {
  //       navigate({ params: { roomId }, to: '/rooms/$roomId/canvas' });
  //       break;
  //     }
  //     default: {
  //       // do nothing
  //     }
  //   }
  // };

  return (
    <Flex
      direction="column"
      // 64px is height of Header
      height="calc(100vh - --var(--toolbar-height))"
      overflow="auto"
    >
      <Box>
        <Text>
          {name} - {description}
        </Text>
      </Box>
      <Tabs.Root defaultValue="messages">
        <Tabs.List>
          <Tabs.Trigger value="messages">Messages</Tabs.Trigger>
          <Tabs.Trigger value="canvas">Canvas</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Outlet />
    </Flex>
  );
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
  errorComponent: () => (
    <Flex align="center" display="flex" justify="center" overflow="hidden">
      <Text>There was an error loading the room</Text>
    </Flex>
  ),
  loader: ({ params: { roomId } }) => queryClient.prefetchQuery(getRoomByIdOptions(roomId)),
  pendingComponent: () => (
    <Flex align="center" justify="center">
      <Text>Loading Room...</Text>
    </Flex>
  ),
});
