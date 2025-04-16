import { Box, Container, Grid, Typography } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Header } from './Header';

const connectionStatusMap = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
} as const;

export const AppWrapper: FC<PropsWithChildren> = ({ children }) => {
  // const { sendMessage, lastMessage, readyState } = useWebSocket('ws/ping', {
  //   onMessage: event => {
  //     console.log('onMessage', event);
  //     // lastMessage is still previous in this callback, gets updated after
  //     console.log('lastMessage', lastMessage);
  //   },
  //   onOpen: event => {
  //     console.log('onOpen', event);
  //     sendMessage('i am message');
  //   },
  // });

  const readyState = ReadyState.UNINSTANTIATED;
  const connectionStatus = connectionStatusMap[readyState];

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
            <Typography>The WebSocket is currently {connectionStatus}</Typography>
          </Grid>
          <Grid size={12}>{children}</Grid>
        </Container>
      </Box>
    </>
  );
};
