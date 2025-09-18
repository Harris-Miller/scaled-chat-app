/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';
import { equals, last, sortBy } from 'ramda';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import { getChats, postChat, useRoom } from '../api/rooms';
import type { Chat, Room } from '../api/rooms';
import { socket } from '../socket';
import { useActiveUser } from '../store/user.selectors';
import { handle } from '../utils';

const SubComponent: FC<Room> = ({ description, id, name }) => {
  const scrollableBoxRef = useRef(null);
  const [message, setMessage] = useState('');

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    getNextPageParam: (lastPage: Chat[]) => {
      return last(lastPage)?.createdAt;
    },
    initialPageParam: new Date().toISOString(),
    queryFn: async ({ pageParam }) => {
      const resp = await axios.get<Chat[]>(`/api/rooms/${id}/chats/?before=${pageParam}`);
      return resp.data;
    },
    queryKey: ['chats', id],
  });

  const allChats = data?.pages.flat() ?? [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allChats.length + 1 : allChats.length,
    estimateSize: () => 100,
    getScrollElement: () => scrollableBoxRef.current,
    overscan: 5, // ?? what do here?
  });

  useEffect(() => {
    const [lastItem] = rowVirtualizer.getVirtualItems().toReversed();

    // false positive
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (lastItem == null) return;

    if (lastItem.index >= allChats.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, fetchNextPage, allChats.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  // useEffect(() => {
  //   const callbackFn = (newChat: Chat) => {
  //     // console.log(newChat);
  //     setChats(current => [...current, newChat]);
  //   };

  //   socket.emit('room:join', { roomId: id, userId: user.id });
  //   socket.on('chat', callbackFn);

  //   return () => {
  //     socket.off('chat', callbackFn);
  //     socket.emit('room:leave', { roomId: id, userId: user.id });
  //   };
  // }, [id, user.id]);

  // useEffect(() => {
  //   getChats(id).then(({ data }) => {
  //     console.log(data);
  //     setChats(data);
  //   });
  // }, [id]);

  const messageHandler = () => {
    if (message.trim() === '') return;

    // socket.emit('chat:text', { roomId: id, text: message, userId: user.id });
    postChat(id, message);
    setMessage('');
  };

  const isOrderedCorrectly = equals(
    allChats,
    sortBy(chat => chat.createdAt, allChats),
  );

  return (
    <Box alignContent="center" display="flex" height="100vh" justifyContent="center">
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
        {/* This structure is required by @tanstack/react-virtual */}
        {/* Outer, scrollable element  */}
        <Box ref={scrollableBoxRef} sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Inner element to container the virtual items  */}
          <Box>
            {/* The virtual items themselves */}
            {rowVirtualizer.getVirtualItems().map(virtualItem => {
              const chat = allChats[virtualItem.index];
              return (
                <Box key={chat.id}>
                  <Typography>
                    createAt: {chat.createdAt} :: text: {chat.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>
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
