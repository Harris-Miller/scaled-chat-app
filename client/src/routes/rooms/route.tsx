import { Box, Flex, Section } from '@radix-ui/themes';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import { Sidebar } from '../../components/Sidebar';
import { TabRail } from '../../components/TabRail';

export const RoomsLayout: FC = () => {
  return (
    <Flex>
      <Box width="440px">
        <Flex bottom="0" left="0" position="fixed" top="var(--toolbar-height)">
          <TabRail />
          <Sidebar />
        </Flex>
      </Box>
      <Flex maxWidth="100%">
        <Section>
          <Outlet />
        </Section>
      </Flex>
    </Flex>
  );
};

export const Route = createFileRoute('/rooms')({
  component: RoomsLayout,
});
