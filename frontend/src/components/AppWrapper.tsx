import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import type { FC, PropsWithChildren } from 'react';

import { Header } from './Header';

console.log('new WebSocket()');
const socket = new WebSocket('ws/ping');

socket.addEventListener('open', event => {
  console.log(event);
  socket.send('i am message');
});

socket.addEventListener('message', event => {
  console.log(event.data);
});

export const AppWrapper: FC<PropsWithChildren> = ({ children }) => {
  // useEffect(() => {
  //   console.log('new WebSocket()');
  //   const socket = new WebSocket('ws/ping');

  //   socket.addEventListener('open', event => {
  //     console.log(event);
  //   });

  //   socket.addEventListener('message', event => {
  //     console.log(event.data);
  //   });

  //   return () => {
  //     console.log('socket.close()');
  //     socket.close();
  //   };
  // }, []);

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
