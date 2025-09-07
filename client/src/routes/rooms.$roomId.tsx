/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';
import { useEffect } from 'react';

import { useRoom } from '../api/rooms';
import type { Room } from '../api/rooms';
import { socket } from '../socket';
import { useActiveUser } from '../store/user.selectors';

const SubComponent: FC<Room> = ({ description, id, name }) => {
  const user = useActiveUser();

  useEffect(() => {
    const callbackFn = (arg: unknown) => {
      console.log(arg);
    };

    socket.emit('room:join', { roomId: id, userId: user.id });
    socket.on('chat', callbackFn);

    return () => {
      socket.off('chat', callbackFn);
      socket.emit('room:leave', { roomId: id, userId: user.id });
    };
  }, [id, user.id]);

  return (
    <Box alignContent="center" display="flex" justifyContent="center">
      <Box>
        <Typography>Room: {id}</Typography>
      </Box>
      <Box>
        <Typography>Name: {name}</Typography>
      </Box>
      <Box>
        <Typography>Description: {description}</Typography>
      </Box>
    </Box>
  );
};

export const RoomComponent: FC = () => {
  const { roomId } = Route.useParams();

  const query = useRoom(roomId);

  if (query.isPending) {
    return (
      <Box alignContent="center" display="flex" justifyContent="center">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!query.isSuccess) {
    return (
      <Box alignContent="center" display="flex" justifyContent="center">
        <Typography>There was an error loading the room</Typography>
      </Box>
    );
  }

  return <SubComponent {...query.data.data} />;
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
  params: {
    parse: params => ({
      roomId: Number.parseInt(params.roomId, 10),
    }),
  },
});
