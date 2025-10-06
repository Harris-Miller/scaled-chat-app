import { Box, Button, Flex, Text, TextField } from '@radix-ui/themes';
import type { AxiosError } from 'axios';
import type { FC } from 'react';
import { useState } from 'react';

import type { ApiError } from '../api/api.types';
import { getProfile, signIn } from '../api/user';
import { useStore } from '../store';
import { handle } from '../utils';

export const SignIn: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setUser } = useStore();

  const signInHandler = async () => {
    try {
      const response = await signIn(email, password).then(getProfile);
      setUser(response.data);
    } catch (err) {
      setErrorMessage((err as AxiosError<ApiError>).response?.data.message ?? 'Unable to reach server');
    }
  };

  return (
    <Flex align="center" direction="column" justify="center">
      <Text>Sign in to continue</Text>
      <Box>
        <Text>E-mail</Text>
        <TextField.Root id="user" onChange={handle(setEmail)} type="text" value={email} />
      </Box>
      <Box>
        <Text>Password</Text>
        <TextField.Root id="pw" onChange={handle(setPassword)} type="password" value={password} />
      </Box>
      <Box>
        <Button onClick={signInHandler}>Sign In</Button>
      </Box>
    </Flex>
  );
};
