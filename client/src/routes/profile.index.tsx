import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Paper, styled, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import type { ChangeEventHandler, FC } from 'react';

import { useStore } from '../store';

const VisuallyHiddenInput = styled('input')({
  bottom: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

const ProfileComponent: FC = () => {
  const { user } = useStore();

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
      <Box alignContent="center" display="flex" justifyContent="center">
        <Typography>Return to homescreen to login</Typography>
      </Box>
    );
  }

  return (
    <Box alignContent="center" display="flex" justifyContent="center">
      <Paper elevation={4}>
        <Typography variant="h2">Profile</Typography>
        <Box>
          <Typography>{user.displayName}</Typography>
          <br />
          <Typography>{user.email}</Typography>
          <br />
        </Box>
        {user.profilePicId != null && (
          <Box>
            <img alt="Profile" loading="eager" src={`/api/user/profile/pic/${user.profilePicId}`} />
          </Box>
        )}
        <Box>
          <Typography variant="h4">Upload Profile Pic</Typography>
          <Button
            component="label"
            role={undefined} // Recommended for accessibility
            startIcon={<CloudUploadIcon />}
            tabIndex={-1} // Prevents the button from being focused directly
            variant="contained"
          >
            Uploadfiles
            <VisuallyHiddenInput accept=".png,.jpg,.jpeg" onChange={fileHandler} type="file" />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export const Route = createFileRoute('/profile/')({
  component: ProfileComponent,
});
