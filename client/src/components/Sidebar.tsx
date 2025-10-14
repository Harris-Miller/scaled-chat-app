import { FrameIcon, PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Heading, IconButton, ScrollArea } from '@radix-ui/themes';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';

import './sidebar.css';

import { useRooms } from '../api/rooms';

// import { CreateChannelDialog } from './dialogs/CreateChannelDialog';

export const Sidebar: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const roomsQuery = useRooms();

  const { roomId } = useParams({ from: '/rooms/$roomId', shouldThrow: false }) ?? { roomId: null };

  const navigate = useNavigate();

  return (
    <Box data-channel-list width="360px">
      <Box>
        <ScrollArea>
          <Flex direction="column">
            <Box>
              <Heading as="h3">
                Channels{' '}
                <IconButton
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                >
                  <PlusIcon />
                </IconButton>
              </Heading>
              {/* <CreateChannelDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> */}
            </Box>
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
            <Box>
              <Heading as="h3">
                Direct Messages{' '}
                <IconButton>
                  <PlusIcon />
                </IconButton>
              </Heading>
            </Box>
          </Flex>
        </ScrollArea>
      </Box>
    </Box>
  );
};
