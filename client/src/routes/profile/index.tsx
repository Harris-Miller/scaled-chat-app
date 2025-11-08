import { UploadIcon } from '@radix-ui/react-icons';
import { Box, Button, Card, Flex, Heading, Text, VisuallyHidden } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import type { ChangeEventHandler, FC } from 'react';
import { useRef } from 'react';

import { useStore } from '../../store';

const ProfileComponent: FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const user = useStore(state => state.user);

  const fileHandler: ChangeEventHandler<HTMLInputElement> = event => {
    console.log(event.currentTarget.files);

    const profilePicFile = event.currentTarget.files?.[0];

    if (profilePicFile == null) return;

    const formData = new FormData();
    formData.append('file', profilePicFile);

    axios
      .post('/api/user/profile/pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(resp => {
        console.log(resp);
      });
  };

  // TODO: make this better
  if (user == null) {
    return (
      <Flex align="center" justify="center">
        <Text>Return to homescreen to login</Text>
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="center">
      <Card>
        <Heading as="h2">Profile</Heading>
        <Box>
          <Text>{user.displayName}</Text>
          <br />
          <Text>{user.email}</Text>
          <br />
        </Box>
        {user.profilePicId != null && (
          <Box>
            <img alt="Profile" loading="eager" src={`/api/user/profile/pic/${user.profilePicId}`} />
          </Box>
        )}
        <Box>
          <Heading as="h4">Upload Profile Pic</Heading>
          <Button
            onClick={() => {
              inputFileRef.current?.click();
            }}
          >
            <UploadIcon /> Uploadfiles
          </Button>
          <VisuallyHidden>
            <input accept=".png,.jpg,.jpeg" onChange={fileHandler} ref={inputFileRef} type="file" />
          </VisuallyHidden>
        </Box>
      </Card>
    </Flex>
  );
};

export const Route = createFileRoute('/profile/')({
  component: ProfileComponent,
});
