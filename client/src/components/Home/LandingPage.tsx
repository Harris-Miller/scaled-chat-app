import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import type { FC } from 'react';
import { useState } from 'react';

import { useCreateRoom } from '../../api/rooms';
import { handle } from '../utils';

export const LandingPage: FC = () => {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');

  const createRoom = useCreateRoom();

  const createHandler = () => {
    createRoom.mutate({ name: roomName });
  };

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Grid size={4}>
        <Typography>Join a Room</Typography>
        <TextField label="Room ID" onChange={handle(setRoomId)} value={roomId} variant="outlined" />
        <Button variant="contained">Join</Button>
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
