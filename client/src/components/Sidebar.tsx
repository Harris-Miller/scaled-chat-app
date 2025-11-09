import { FrameIcon, PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Heading, IconButton, ScrollArea } from '@radix-ui/themes';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { FC } from 'react';

import './sidebar.css';

import { useRooms } from '../api/rooms';

import { CreateChannelDialog } from './dialogs/CreateChannelDialog';

export const Sidebar: FC = () => {
  const roomsQuery = useRooms();

  const { roomId } = useParams({ from: '/rooms/$roomId', shouldThrow: false }) ?? { roomId: null };

  const navigate = useNavigate();

  return (
    <Box className="sidebar" data-channel-list p="4" width="360px">
      <Box>
        <ScrollArea>
          <Flex direction="column">
            <Flex align="center">
              <Heading as="h3" mr="2">
                Channels
              </Heading>
              <CreateChannelDialog />
            </Flex>
            <Flex direction="column">
              {roomsQuery.data?.map(room => (
                <Button
                  className={room.id === roomId ? 'channel-button-selected' : 'channel-button'}
                  key={room.id}
                  onClick={() => navigate({ params: { roomId: room.id }, to: '/rooms/$roomId' })}
                  variant="outline"
                >
                  <FrameIcon /> {room.name}
                </Button>
              ))}
            </Flex>
            <Flex align="center">
              <Heading as="h3" mr="2">
                Direct Messages
              </Heading>
              <IconButton size="1">
                <PlusIcon />
              </IconButton>
            </Flex>
          </Flex>
        </ScrollArea>
      </Box>
    </Box>
  );
};
