import { Button, Grid, List, ListItem, Stack, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';

import { queryClient } from '../api/queryClient';
import { getRoom, getRooms, useCreateRoom } from '../api/rooms';
import { handle } from '../utils';

export const LandingPage: FC = () => {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const createRoom = useCreateRoom();

  const roomsQuery = useQuery({
    queryFn: () => getRooms().then(({ data }) => data),
    queryKey: ['rooms'],
  });

  const createHandler = () => {
    createRoom
      .mutateAsync({ name: roomName })
      .then(({ data }) => navigate({ params: { roomId: data.id }, to: '/rooms/$roomId' }));
  };

  const joinHandler = () => {
    if (roomId.trim() === '') {
      // TODO: error message
      return;
    }

    getRoom(roomId)
      .then(({ data }) => {
        queryClient.setQueryData(['room', data.id], data);
        navigate({ params: { roomId: data.id }, to: '/rooms/$roomId' });
      })
      .catch(() => {
        // TODO: error message
      });
  };

  return (
    <>
      <Grid size={12} sx={{ marginBottom: '2rem' }}>
        <Stack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid size={4}>
            <Typography>Join a Room</Typography>
            <TextField label="Room ID" onChange={handle(setRoomId)} value={roomId} variant="outlined" />
            <Button
              onClick={() => {
                joinHandler();
              }}
              variant="contained"
            >
              Join
            </Button>
          </Grid>
          <Grid size={4}>
            <Typography>Or Create a New Room</Typography>
            <TextField label="Room Name" onChange={handle(setRoomName)} value={roomName} variant="outlined" />
            <Button
              onClick={() => {
                createHandler();
              }}
              variant="contained"
            >
              Create
            </Button>
          </Grid>
          <Grid size={4}>
            {createRoom.isError ? <Typography component="div">{createRoom.error.message}</Typography> : null}
          </Grid>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Stack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid size={4}>
            <Typography>Available Rooms</Typography>
          </Grid>
          <Grid size={4}>
            <List>
              {(roomsQuery.data ?? []).map(r => (
                <ListItem key={r.id}>
                  <Link params={{ roomId: r.id }} to="/rooms/$roomId">
                    {r.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Stack>
      </Grid>
    </>
  );
};
