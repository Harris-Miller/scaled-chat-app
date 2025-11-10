import { Avatar, Box, Flex, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import type { FC } from 'react';

import type { Chat } from '../../../api/chats';
import type { User } from '../../../api/user';

export const Message: FC<{ chat: Chat }> = ({ chat }) => {
  const author = useQuery({
    queryFn: async () => {
      const otherUser = await axios.get<User>(`/api/user/${chat.authorId}`);
      return otherUser.data;
    },
    queryKey: ['user', chat.authorId],
  });

  const profilePicSrc = author.data?.profilePicId;

  const timestamp = format(parseISO(chat.updatedAt), 'p');

  return (
    <Flex>
      <Box>
        <Avatar fallback={author.data?.displayName[0].toUpperCase() ?? ''} src={`/profile/pic/${profilePicSrc}`} />
      </Box>
      <Box flexGrow="1">
        <Box>
          <Text weight="bold">{author.data?.displayName}</Text>
          &nbsp;&nbsp;
          <Text>{timestamp}</Text>
        </Box>
        <Box>
          <Text>{chat.text}</Text>
        </Box>
      </Box>
    </Flex>
  );
};
