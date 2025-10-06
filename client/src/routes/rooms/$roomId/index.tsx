/* eslint-disable @typescript-eslint/no-use-before-define */
import { ReloadIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { head } from 'ramda';
import { useEffect, useState } from 'react';

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
      <Box>
        {isFetchingPreviousPage ? (
          <Flex align="center" p="10px">
            <ReloadIcon />
          </Flex>
        ) : null}
        {!isFetchingPreviousPage && !hasPreviousPage && (
          <Flex align="center" p="10px">
            <Text>You&apos;re at the top!</Text>
          </Flex>
        )}
        {!isFetchingPreviousPage && hasPreviousPage ? (
          <Flex align="center" p="10px">
            <Button
              onClick={() => {
                fetchPreviousPage();
              }}
            >
              Load More
            </Button>
          </Flex>
        ) : null}
        {allChats.map(chat => (
          <Box key={chat.id}>
            <Text>{chat.text}</Text>
          </Box>
        ))}
      </Box>
      <Flex direction="row">
        <Box flexGrow="1">
          <TextField.Root onChange={handle(setMessage)} value={message} />
        </Box>
        <Flex align="center" mr="12">
          <Button
            onClick={() => {
              messageHandler();
            }}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export const Route = createFileRoute('/rooms/$roomId/')({
  component: MessagesComponent,
});
