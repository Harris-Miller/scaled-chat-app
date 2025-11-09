import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { Avatar, Box, Flex, IconButton, Text } from '@radix-ui/themes';
import type { FC } from 'react';

import { useActiveUser } from '../store/user.selectors';

import { CustomLink } from './CustomLink';

export const TabRail: FC = () => {
  const { user } = useActiveUser();

  return (
    <Flex align="center" data-tab-rail direction="column" justify="between" width="70px">
      <Flex direction="column" gap="3">
        <Box>
          <Avatar fallback="HM" size="3" />
        </Box>
        <Flex align="center" direction="column">
          <IconButton size="3">
            <HomeIcon />
          </IconButton>
          <Text size="1">Home</Text>
        </Flex>
        <Flex align="center" direction="column">
          <IconButton size="3">
            <ChatBubbleIcon />
          </IconButton>
          <Text size="1">DMs</Text>
        </Flex>
      </Flex>
      <Box mb="5">
        <CustomLink to="/profile">
          <Avatar fallback="U" src={`/api/user/profile/pic/${user.profilePicId}/thumb`} />
        </CustomLink>
      </Box>
    </Flex>
  );
};
