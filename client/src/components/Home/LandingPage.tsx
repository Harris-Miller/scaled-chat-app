import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import type { FC } from 'react';
import { useState } from 'react';

import { handle } from '../utils';

export const LandingPage: FC = () => {
  const [roomId, setRoomId] = useState('');

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Grid size={4}>
        <Typography>Join a Room</Typography>
        <TextField label="Room ID" onChange={handle(setRoomId)} value={roomId} variant="outlined" />
        <Button variant="contained">Join</Button>
      </Grid>
      <Grid size={4}>
        <Typography>Or Create a New Room</Typography>
        <Button variant="contained">Create</Button>
      </Grid>
    </Stack>
  );
};
