import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';

import { useRooms } from '../api/rooms';

import { CreateChannelDialog } from './dialogs/CreateChannelDialog';

const drawerWidth = 360;

export const Sidebar: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const roomsQuery = useRooms();

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
            <Typography variant="h3">
              Channels{' '}
              <IconButton
                onClick={() => {
                  setDialogOpen(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Typography>
            <CreateChannelDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
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
