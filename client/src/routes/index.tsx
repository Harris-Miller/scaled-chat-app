import { FrameIcon } from '@radix-ui/react-icons';
import { Box, Container, Flex, Grid, Heading, Section, Separator } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

import { SignIn } from './-signin';
import { SignUp } from './-signup';

const IndexComponent: FC = () => {
  return (
    <Container>
      <Grid columns="3">
        <Box />
        <Box>
          <Section size="2">
            <Flex align="center" gap="2" justify="center">
              <FrameIcon height="20px" width="20px" />
              <Heading>Scaled Chat App</Heading>
            </Flex>
          </Section>
          <Section size="1">
            <SignIn />
            <Flex justify="center" py="4">
              <Flex align="center" flexGrow="1">
                <Separator size="4" />
              </Flex>
              <Box mx="4">OR</Box>
              <Flex align="center" flexGrow="1">
                <Separator size="4" />
              </Flex>
            </Flex>
            <SignUp />
          </Section>
        </Box>
        <Box />
      </Grid>
    </Container>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
