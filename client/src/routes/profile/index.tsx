import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { assoc } from 'ramda';
import type { ChangeEventHandler, FC } from 'react';
import { useRef } from 'react';

import { uploadPic } from '../../api/user';
import { FullScreenCenter } from '../../components/FullScreenCenter';
import { useStore } from '../../store';

const ProfileComponent: FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useStore();

  const profilePic = useMutation({
    mutationFn: uploadPic,
    onError: (_error, _variables, _onMutateResult, _context) => {
      // TODO
    },
    onSuccess: (data, _variables, _onMutateResult, _context) => {
      setUser(assoc('profilePicId', data.picId, user!));
    },
  });

  const fileHandler: ChangeEventHandler<HTMLInputElement> = event => {
    console.log(event.currentTarget.files);

    const profilePicFile = event.currentTarget.files?.[0];

    if (profilePicFile == null) return;

    const formData = new FormData();
    formData.append('file', profilePicFile);

    profilePic.mutate(formData);
  };

  // TODO: make this better
  if (user == null) {
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Typography>Return to homescreen to login</Typography>
      </Box>
    );
  }

  return (
    <FullScreenCenter>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '24px' }}>
          <Typography variant="h2">Profile</Typography>
          <Typography>{user.displayName}</Typography>
          <Typography>{user.email}</Typography>
          {user.profilePicId != null && (
            <Box>
              <img alt="Profile" loading="eager" src={`/api/user/profile/pic/${user.profilePicId}`} />
            </Box>
          )}
          <Typography variant="h4">Upload Profile Pic</Typography>
          <Button
            onClick={() => {
              inputFileRef.current?.click();
            }}
            startIcon={<FileUploadIcon />}
            variant="contained"
          >
            Uploadfiles
          </Button>
          <Box sx={{ display: 'none' }}>
            <input accept=".png,.jpg,.jpeg" onChange={fileHandler} ref={inputFileRef} type="file" />
          </Box>
        </Paper>
      </Container>
    </FullScreenCenter>
  );
};

export const Route = createFileRoute('/profile/')({
  component: ProfileComponent,
});
