import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { Avatar, Box, Flex, IconButton } from '@radix-ui/themes';
import type { FC } from 'react';

export const TabRail: FC = () => (
  <Flex align="center" data-tab-rail direction="column" gap="3" width="70px">
    <Box>
      <Avatar fallback="S" />
    </Box>
    <Box>
      <IconButton>
        <HomeIcon />
      </IconButton>
    </Box>
    <Box>
      <IconButton>
        <ChatBubbleIcon />
      </IconButton>
    </Box>
  </Flex>
);
