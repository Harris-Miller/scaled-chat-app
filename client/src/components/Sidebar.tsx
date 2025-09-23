import TagIcon from '@mui/icons-material/Tag';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { FC } from 'react';

import { getRooms } from '../api/rooms';

const drawerWidth = 360;

export const Sidebar: FC = () => {
  const roomsQuery = useQuery({
    queryFn: () => getRooms(),
    queryKey: ['rooms'],
  });

  const { roomId } = useParams({ from: '/rooms/$roomId', shouldThrow: false }) ?? { roomId: null };

  const navigate = useNavigate();

  return (
    <Drawer
      sx={{
        [`& .MuiDrawer-paper`]: { boxSizing: 'border-box', width: drawerWidth },
        flexShrink: 0,
        width: drawerWidth,
      }}
      variant="permanent"
    >
      {/* Empty <Toolbar /> is here to add the height of the AppBar */}
      <Toolbar />
      <Box sx={{ overflow: 'auto', padding: 2 }}>
        <Stack mb={2}>
          <Box mb={1}>
            <Typography variant="h3">Channels</Typography>
          </Box>
          <Box pl={1}>
            <List dense>
              {roomsQuery.data?.map(room => (
                <ListItemButton
                  key={room.id}
                  onClick={() => navigate({ params: { roomId: room.id }, to: '/rooms/$roomId' })}
                  selected={room.id === roomId}
                >
                  <ListItemIcon>
                    <TagIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{room.name}</ListItemText>
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Stack>
        <Stack mb={2}>
          <Box>
            <Typography variant="h3">Direct Messages</Typography>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};
