import { Avatar, Box, Typography } from '@mui/material';
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
    <Box sx={{ display: 'flex', margin: 2 }}>
      <Box sx={{ marginRight: 2 }}>
        <Avatar src={`/profile/pic/${profilePicSrc}`}>{author.data?.displayName[0].toUpperCase() ?? ''}</Avatar>
      </Box>
      <Box sx={{ flexGrow: '1' }}>
        <Box>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            {author.data?.displayName}
          </Typography>
          &nbsp;&nbsp;
          <Typography component="span" variant="body2">
            {timestamp}
          </Typography>
        </Box>
        <Box>
          <Typography>{chat.text}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
