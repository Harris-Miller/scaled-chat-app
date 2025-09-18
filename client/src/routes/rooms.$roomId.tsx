/* eslint-disable @typescript-eslint/no-use-before-define */
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { head } from 'ramda';
import type { FC, RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Chat } from '../api/chats';
import { postChat } from '../api/chats';
import { useRoom } from '../api/rooms';
import type { Room } from '../api/rooms';
import { socket } from '../socket';
import { useActiveUser } from '../store/user.selectors';
import { handle } from '../utils';

const SubComponent: FC<Room> = ({ description, id, name }) => {
  const scrollableBoxRef = useRef<HTMLElement>(null);
  const innerBoxRef = useRef<HTMLElement>(null);
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

  // TODO: add virtualization scrolling
  const allChats = data?.pages.flat() ?? [];

  useEffect(() => {
    if (scrollableBoxRef.current == null) return;
    if (innerBoxRef.current == null) return;
    if (isFetchingPreviousPage) return;

    if (scrollableBoxRef.current.clientHeight >= innerBoxRef.current.clientHeight) {
      fetchPreviousPage();
    }
  }, [
    scrollableBoxRef.current?.clientHeight,
    innerBoxRef.current?.clientHeight,
    isFetchingPreviousPage,
    fetchPreviousPage,
  ]);

  // const scrollHandler = useCallback(() => {
  //   const div = innerBoxRef.current;
  //   if (!isFetchingPreviousPage && (div?.scrollTop ?? Infinity) < 20) {
  //     fetchPreviousPage();
  //   }
  // }, [fetchPreviousPage, isFetchingPreviousPage]);

  // useEffect(() => {
  //   const div = scrollableBoxRef.current;

  //   div?.addEventListener('scroll', scrollHandler);

  //   return () => {
  //     div?.removeEventListener('scroll', scrollHandler);
  //   };
  // }, [scrollHandler]);

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
      </Stack>
      {/* Outer, scrollable element  */}
      <Box data-id="scrollableBox" ref={scrollableBoxRef} sx={{ height: '500px', overflow: 'scroll' }}>
        {/* Inner element to container the items to scroll through  */}
        <Box data-id="inner" ref={innerBoxRef} sx={{ position: 'relative' }}>
          {isFetchingPreviousPage ? (
            <Box sx={{ padding: '10px', textAlign: 'center' }}>
              <RefreshIcon fontSize="small" />
            </Box>
          ) : null}
          {!isFetchingPreviousPage && !hasPreviousPage && (
            <Box sx={{ padding: '10px', textAlign: 'center' }}>
              <Typography variant="body2">You&apos;re at the top!</Typography>
            </Box>
          )}
          {!isFetchingPreviousPage && hasPreviousPage ? (
            <Box sx={{ padding: '10px', textAlign: 'center' }}>
              <Button
                onClick={() => {
                  fetchPreviousPage();
                }}
                size="small"
              >
                Load More
              </Button>
            </Box>
          ) : null}
          {allChats.map(chat => (
            <Box key={chat.id}>
              <Typography>
                id: {chat.id} :: text: {chat.text}
              </Typography>
            </Box>
          ))}
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
