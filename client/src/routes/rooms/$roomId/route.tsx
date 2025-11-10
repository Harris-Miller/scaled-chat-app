/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Flex, Tabs, Text } from '@radix-ui/themes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { queryClient } from '../../../api/queryClient';
import { getRoomByIdOptions } from '../../../api/rooms';

import './rooms.css';

const RoomComponent: FC = () => {
  const { roomId } = Route.useParams();
  const {
    data: { description, name },
  } = useSuspenseQuery(getRoomByIdOptions(roomId));

  return (
    <Flex direction="column" width="100%">
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
      <Flex flexGrow="1">
        <Outlet />
      </Flex>
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
