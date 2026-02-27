import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import type { FC } from 'react';

import { useRooms } from '../../api/rooms';
import { CreateChannelDialog } from '../../components/dialogs/CreateChannelDialog';
import { RouterButtonLink } from '../../components/RouterLink';

export const SideBar: FC = () => {
  const roomsQuery = useRooms();
  const { roomId } = useParams({ from: '/rooms/$roomId', shouldThrow: false }) ?? { roomId: null };

  return (
    <Box sx={{ overflow: 'scroll' }}>
      <Typography variant="h3">
        Channels <CreateChannelDialog />
      </Typography>
      <Box sx={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
        {roomsQuery.data?.map(room => (
          <RouterButtonLink
            key={room.id}
            params={{ roomId: room.id }}
            to="/rooms/$roomId"
            variant={roomId === room.id ? 'contained' : 'text'}
          >
            {room.name}
          </RouterButtonLink>
        ))}
      </Box>
      <Box>
        <Typography variant="h3">
          Direct Messages{' '}
          <IconButton>
            <AddIcon />
          </IconButton>
        </Typography>
      </Box>
    </Box>
  );
};
