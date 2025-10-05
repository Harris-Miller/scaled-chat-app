// import { Box, Container, Toolbar } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { socket } from '../socket';

import { Toolbar } from './Toolbar';

// import { Header } from './Header';

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
      <Toolbar />
      {children}
    </>
  );
};
