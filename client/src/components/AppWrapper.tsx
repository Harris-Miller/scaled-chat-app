import { Box, Container } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { socket } from '../socket';

import { Header } from './Header';

export const AppWrapper: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    const onConnect = () => {
      socket.emit('ping');
    };

    const onDisconnect = () => {
      // noop, for now
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
        <Container maxWidth={false}>{children}</Container>
      </Box>
    </>
  );
};
