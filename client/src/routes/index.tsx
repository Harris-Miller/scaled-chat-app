import ChatIcon from '@mui/icons-material/Chat';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import type { FC } from 'react';

import type { ApiError } from '../api/api.types';
import { getProfile, signIn } from '../api/user';
import { FullScreenCenter } from '../components/FullScreenCenter';
import { useStore } from '../store';
import { handle } from '../utils';

// import { SignIn } from './-signin';
// import { SignUp } from './-signup';

const IndexComponent: FC = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const { setUser } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TODO
  const _signInHandler = async () => {
    try {
      const response = await signIn(email, password).then(getProfile);
      setUser(response.data);
    } catch (err) {
      setErrorMessage((err as AxiosError<ApiError>).response?.data.message ?? 'Unable to reach server');
    }
  };

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
          <Button
            startIcon={<GoogleIcon />}
            sx={{ '&:hover': { cursor: 'not-allowed' }, marginBottom: '12px', width: '100%' }}
            variant="outlined"
          >
            Google
          </Button>
          <Button
            startIcon={<FacebookIcon />}
            sx={{ '&:hover': { cursor: 'not-allowed' }, marginBottom: '12px', width: '100%' }}
            variant="outlined"
          >
            Facebook
          </Button>
          <Box sx={{ marginBottom: '12px' }}>
            <Typography>Or</Typography>
          </Box>
          <Box sx={{ marginBottom: '12px' }}>
            <Box>
              <TextField id="email" label="Email" onChange={handle(setEmail)} value={email} />
            </Box>
            <Box>
              <TextField
                id="password"
                label="Password"
                onChange={handle(setPassword)}
                type="password"
                value={password}
              />
            </Box>
          </Box>
          <Box sx={{ marginBottom: '12px' }}>
            <Button sx={{ marginBottom: '12px', width: '100%' }} variant="contained">
              Sign In with Email
            </Button>
            {errorMessage != null ? <Alert severity="error">{errorMessage}</Alert> : null}
          </Box>
        </Paper>
      </Container>
    </FullScreenCenter>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
