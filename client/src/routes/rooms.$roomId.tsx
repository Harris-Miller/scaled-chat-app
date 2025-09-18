/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';
import { head, isNotEmpty, nth, uniqBy } from 'ramda';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { Chat } from '../api/chats';
import { postChat } from '../api/chats';
import { useRoom } from '../api/rooms';
import type { Room } from '../api/rooms';
import { socket } from '../socket';
import { useActiveUser } from '../store/user.selectors';
import { handle } from '../utils';

const SubComponent: FC<Room> = ({ description, id, name }) => {
  const scrollableBoxRef = useRef<HTMLElement>(null);
  const [message, setMessage] = useState('');

  const { data, fetchPreviousPage, isFetchingPreviousPage, hasPreviousPage } = useInfiniteQuery({
    getNextPageParam: () => null,
    getPreviousPageParam: (firstPage: Chat[]) => {
      return head(firstPage)?.id;
    },
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const url = pageParam == null ? `/api/rooms/${id}/chats` : `/api/rooms/${id}/chats?cursor=${pageParam}`;
      const resp = await axios.get<Chat[]>(url);
      return resp.data.reverse();
    },
    queryKey: ['chats', id],
  });

  const allChats = data?.pages.flat() ?? [];

  const virtualizer = useVirtualizer({
    count: hasPreviousPage ? allChats.length + 1 : allChats.length,
    estimateSize: () => 24, // This is the size of the "element" rendered, not total length of data
    getScrollElement: () => scrollableBoxRef.current,
    overscan: 5, // ?? what do here?
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const firstItem = head(virtualItems);

    if (firstItem?.index === 0 && hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
  }, [hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage, virtualItems]);

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

  return (
    <Box
      data-id="SubComponent"
      display="flex"
      flexDirection="column"
      sx={{ height: 'calc(100vh - 48px)', overflow: 'hidden' }}
    >
      <Stack data-id="Stack">
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
        <Box>
          <Button
            onClick={() => {
              fetchPreviousPage();
            }}
          >
            Load More
          </Button>
        </Box>
      </Stack>
      {/* This structure is required by @tanstack/react-virtual */}
      {/* Outer, scrollable element  */}
      <Box data-id="scrollableBox" ref={scrollableBoxRef} sx={{ height: '500px', overflow: 'auto' }}>
        {/* Inner element to container the virtual items  */}
        <Box data-id="inner" sx={{ position: 'relative' }}>
          {/* The virtual items themselves */}
          {virtualizer.getVirtualItems().map((virtualItem, _i, _arr) => {
            const inner = (() => {
              if (virtualItem.index === 0) {
                if (!hasPreviousPage) return null;
                return (
                  <Box sx={{ padding: '10px', textAlign: 'center' }}>
                    <Typography>Loading...</Typography>
                  </Box>
                );
              }

              const chat = nth(virtualItem.index - 1, allChats);

              if (chat == null) {
                console.log('The virtualItem.index has exceeded allChats. This should never happen');
                return null;
              }

              return (
                <Box>
                  <Typography>
                    id: {chat.id} :: text: {chat.text}
                  </Typography>
                </Box>
              );
            })();

            return (
              <Box data-index={virtualItem.index} key={virtualItem.key} ref={virtualizer.measureElement}>
                {inner}
              </Box>
            );
          })}
        </Box>
      </Box>
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
        <Typography>Loading Room...</Typography>
      </Box>
    );
  }

  if (!query.isSuccess) {
    return (
      <Box alignContent="center" display="flex" justifyContent="center" overflow="hidden">
        <Typography>There was an error loading the room</Typography>
      </Box>
    );
  }

  return <SubComponent {...query.data} />;
};

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomComponent,
});
