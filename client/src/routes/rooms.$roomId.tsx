/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { equals, sortBy } from 'ramda';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { getChats, postChat, useRoom } from '../api/rooms';
import type { Chat, Room } from '../api/rooms';
import { socket } from '../socket';
import { useActiveUser } from '../store/user.selectors';
import { handle } from '../utils';

const SubComponent: FC<Room> = ({ description, id, name }) => {
  const user = useActiveUser();

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const callbackFn = (newChat: Chat) => {
      // console.log(newChat);
      setChats(current => [...current, newChat]);
    };

    socket.emit('room:join', { roomId: id, userId: user.id });
    socket.on('chat', callbackFn);

    return () => {
      socket.off('chat', callbackFn);
      socket.emit('room:leave', { roomId: id, userId: user.id });
    };
  }, [id, user.id]);

  useEffect(() => {
    getChats(id).then(({ data }) => {
      console.log(data);
      setChats(data);
    });
  }, [id]);

  const messageHandler = () => {
    if (message.trim() === '') return;

    // socket.emit('chat:text', { roomId: id, text: message, userId: user.id });
    postChat(id, message);
    setMessage('');
  };

  const isOrderedCorrectly = equals(
    chats,
    sortBy(chat => chat.createdAt, chats),
  );

  return (
    <Box alignContent="center" display="flex" justifyContent="center">
      <Stack>
        <Box>
          <Typography>Room: {id}</Typography>
        </Box>
        <Box>
          <Typography>Name: {name}</Typography>
        </Box>
        <Box>
          <Typography>Description: {description}</Typography>
        </Box>
        <Box>
          <TextField label="Message" onChange={handle(setMessage)} value={message} variant="outlined" />
          <Button
            onClick={() => {
              messageHandler();
            }}
            variant="contained"
          >
            Submit
          </Button>
        </Box>
        <Box>Is ordered correctly? {isOrderedCorrectly ? 'yes' : 'no'}</Box>
        <Box>
          {chats.map(chat => (
            <Box key={chat.id}>
              <Typography>
                createAt: {chat.createdAt} :: text: {chat.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export const RoomComponent: FC = () => {
  // TODO: redirect to `/` if not authed

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

  return <SubComponent {...query.data} />;
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
});
