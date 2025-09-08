import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';

import { queryClient } from '../api/queryClient';
import { getRoom, useCreateRoom } from '../api/rooms';
import { handle } from '../utils';

export const LandingPage: FC = () => {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const createRoom = useCreateRoom();

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
  );
};
