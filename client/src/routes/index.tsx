import ChatIcon from '@mui/icons-material/Chat';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';

import { FullScreenCenter } from '../components/FullScreenCenter';
import { useStore } from '../store';

// import { SignIn } from './-signin';
// import { SignUp } from './-signup';

const IndexComponent: FC = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);

  // TODO: this nav should happen not in the index page, but in the pre-loader
  if (user != null) {
    navigate({ to: '/rooms' });
    return null;
  }

  return (
    <FullScreenCenter>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '24px' }}>
          <Typography sx={{ marginBottom: '24px' }} variant="h3">
            <ChatIcon fontSize="large" /> Scaled Chat App
          </Typography>
          <Typography sx={{ marginBottom: '24px' }} variant="h5">
            Sign In
          </Typography>
          <Button startIcon={<GoogleIcon />} sx={{ marginBottom: '12px', width: '100%' }} variant="outlined">
            Google
          </Button>
          <Button startIcon={<FacebookIcon />} sx={{ marginBottom: '12px', width: '100%' }} variant="outlined">
            Facebook
          </Button>
          <Box sx={{ marginBottom: '12px' }}>
            <Typography>Or</Typography>
          </Box>
          <Box sx={{ marginBottom: '12px' }}>
            <Box>
              <TextField id="email" label="Email" />
            </Box>
            <Box>
              <TextField id="password" label="Password" type="password" />
            </Box>
          </Box>
          <Box sx={{ marginBottom: '12px' }}>
            <Button sx={{ marginBottom: '12px', width: '100%' }} variant="contained">
              Sign In with Email
            </Button>
          </Box>
        </Paper>
      </Container>
    </FullScreenCenter>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
