/* eslint-disable @typescript-eslint/no-use-before-define */
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { head } from 'ramda';
import { useEffect, useRef, useState } from 'react';

import { postChat } from '../../../api/chats';
import type { Chat } from '../../../api/chats';
import { queryClient } from '../../../api/queryClient';
import { getRoomByIdOptions } from '../../../api/rooms';
import { socket } from '../../../socket';
import { useActiveUser } from '../../../store/user.selectors';
import { handle } from '../../../utils';

const addChatToBottom = (roomId: string, chat: Chat) => {
  queryClient.setQueryData<{ pageParams: string[]; pages: Chat[][] }>(['chats', roomId], oldData => {
    // oldData will be the existing cached data for your infinite query,
    // which has a 'pages' array and 'pageParams' array.

    if (oldData == null) {
      // Handle the case where no data is yet cached for this query
      return {
        // Start with your new page
        pageParams: [chat.id],
        pages: [[chat]], // Add the corresponding page param
      };
    }

    return {
      pageParams: [...oldData.pageParams, chat.id],
      pages: [...oldData.pages, [chat]],
    };
  });
};

const MessagesComponent = () => {
  const { roomId } = Route.useParams();
  const {
    data: { id },
  } = useSuspenseQuery(getRoomByIdOptions(roomId));

  const user = useActiveUser();
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

  useEffect(() => {
    const callbackFn = (newChat: Chat) => {
      addChatToBottom(id, newChat);
    };

    socket.emit('room:join', { roomId: id, userId: user.id });
    socket.on('chat', callbackFn);

    return () => {
      socket.off('chat', callbackFn);
      socket.emit('room:leave', { roomId: id, userId: user.id });
    };
  }, [id, user.id]);

  const messageHandler = () => {
    if (message.trim() === '') return;

    // socket.emit('chat:text', { roomId: id, text: message, userId: user.id });
    postChat(id, message);
    setMessage('');
  };
  return (
    <>
      {/* Outer, scrollable element  */}
      <Box data-id="scrollableBox" ref={scrollableBoxRef} sx={{ flexGrow: 2, overflow: 'scroll' }}>
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
              <Typography>{chat.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <Box flexGrow={2}>
          <TextField fullWidth label="Message" onChange={handle(setMessage)} value={message} variant="outlined" />
        </Box>
        <Box alignContent="center" mr={12}>
          <Button
            onClick={() => {
              messageHandler();
            }}
            size="large"
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export const Route = createFileRoute('/rooms/$roomId/')({
  component: MessagesComponent,
});
