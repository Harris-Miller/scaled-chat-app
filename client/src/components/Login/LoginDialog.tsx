import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import type { DialogProps } from '@mui/material';
import type { AxiosError } from 'axios';
import { dissoc } from 'ramda';
import type { ChangeEventHandler, Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';

import type { ApiError } from '../../api/api.types';
import { getProfile, signIn, signUp } from '../../api/user';
import { useStore } from '../../store';

const handle =
  (fn: Dispatch<SetStateAction<string>>): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
  e => {
    fn(e.currentTarget.value);
  };

export const LoginDialog: FC<DialogProps> = props => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setUser } = useStore();

  const signUpHandler = async () => {
    try {
      const response = await signUp(email, password).then(getProfile);
      console.log(response.data);
      setUser(dissoc('success', response.data));
      // setDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorMessage((err as AxiosError<ApiError>).response?.data.message ?? 'Unable to reach server');
    }
  };

  const signInHandler = async () => {
    try {
      const response = await signIn(email, password).then(getProfile);

      console.log(response);
      setUser(response.data);
      // setDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorMessage((err as AxiosError<ApiError>).response?.data.message ?? 'Unable to reach server');
    }
  };

  return (
    <Dialog {...props}>
      <DialogTitle>Sign in or Sign up to continue</DialogTitle>
      <DialogContent>
        <Stack>
          <TextField label="E-mail" onChange={handle(setEmail)} value={email} variant="outlined" />
          <TextField label="Display Name" onChange={handle(setDisplayName)} value={displayName} variant="outlined" />
          <TextField
            label="Password"
            onChange={handle(setPassword)}
            type="password"
            value={password}
            variant="outlined"
          />
          {errorMessage ?? <Typography component="div">{errorMessage}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            // setDialogOpen(false);
            setErrorMessage(null);
          }}
        >
          Cancel
        </Button>
        <Button onClick={signUpHandler}>Sign Up</Button>
        <Button onClick={signInHandler}>Sign In</Button>
      </DialogActions>
    </Dialog>
  );
};
