import { Box, Flex } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

export const RoomsIndexComponent: FC = () => {
  return (
    <Flex justify="center">
      <Box>Le Chat Rooms</Box>
    </Flex>
  );
};

export const Route = createFileRoute('/rooms/')({
  component: RoomsIndexComponent,
});
