import { Box, Container, Grid, Typography } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { socket } from '../socket';

import { Header } from './Header';

export const AppWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('ping');
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onPong = (msg: string) => {
      console.log('pong received', msg);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('pong', onPong);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('pong', onPong);
    };
  }, []);

  return (
    <>
      <Header />

      <Box
        component="main"
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Container maxWidth={false}>
          <Grid size={12}>
            <Typography>The WebSocket is currently {isConnected ? 'connected' : 'disconnected'}</Typography>
          </Grid>
          <Grid size={12}>{children}</Grid>
        </Container>
      </Box>
    </>
  );
};
