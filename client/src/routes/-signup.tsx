import { Alert, Box, Button, TextField } from '@mui/material';
// odd false-positive, the function exists at runtime
// eslint-disable-next-line import/named
import { isAxiosError } from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { Result } from 'try';

import { getProfile, signIn, signUp } from '../api/user';
import { useStore } from '../store';
import { handle } from '../utils';

export const SignUp: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setUser } = useStore();

  // eslint-disable-next-line complexity
  const dualHandler = async () => {
    // first, try to sign-in
    const [signInOk, signInError, userCreds] = await Result.try(signIn(email, password).then(getProfile));

    if (signInOk) {
      setErrorMessage(null);
      setUser(userCreds.data);
      // that's all we need to do here, redirect happens elsewhere
      return;
    }

    // now handle the unhappy path
    // if not an axios error, special handle and bail
    if (!isAxiosError<{ message: string }>(signInError)) {
      setErrorMessage('Something is horribly wrong');
      console.error(signInError);
      return;
    }

    // 404 returns if user-not-found, so first handle password issues
    if (signInError.response?.status !== 404) {
      setErrorMessage(signInError.response?.data.message ?? 'Unknown server error');
      return;
    }

    // else, the user was not found, so we try to sign them up
    const [signUpOk, signUpError, newUserCreds] = await Result.try(signUp(email, password).then(getProfile));

    if (signUpOk) {
      setErrorMessage(null);
      setUser(newUserCreds.data);
      // that's all we need to do here, redirect happens elsewhere
      return;
    }

    // handle the unhappy path again
    // if not an axios error, special handle and bail
    if (!isAxiosError<{ message: string }>(signUpError)) {
      setErrorMessage('Something is horribly wrong');
      console.error(signUpError);
      return;
    }

    setErrorMessage(signUpError.response?.data.message ?? 'Unknown server error');
  };

  return (
    <>
      <Box sx={{ marginBottom: '12px' }}>
        <Box>
          <TextField id="email" label="Email" onChange={handle(setEmail)} value={email} />
        </Box>
        <Box>
          <TextField id="password" label="Password" onChange={handle(setPassword)} type="password" value={password} />
        </Box>
      </Box>
      <Box sx={{ marginBottom: '12px' }}>
        <Button onClick={dualHandler} sx={{ marginBottom: '12px', width: '100%' }} variant="contained">
          Sign In / Register with Email
        </Button>
        {errorMessage != null ? <Alert severity="error">{errorMessage}</Alert> : null}
      </Box>
    </>
  );
};
