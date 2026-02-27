import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar, Box } from '@mui/material';
import type { FC } from 'react';

import { RouterLink } from '../../components/RouterLink';
import { useActiveUser } from '../../store/user.selectors';

export const TabRail: FC = () => {
  const { user } = useActiveUser();

  return (
    <Box sx={{ width: '72px' }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Avatar>HM</Avatar>
        <Avatar>
          <HomeIcon />
        </Avatar>
        <Avatar>
          <ChatBubbleIcon />
        </Avatar>
        <RouterLink to="/profile">
          <Avatar src={`/api/user/profile/pic/${user.profilePicId}/thumb`}>HM</Avatar>
        </RouterLink>
      </Box>
    </Box>
  );
};
