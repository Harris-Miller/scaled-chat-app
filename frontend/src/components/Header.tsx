import { Login as LoginIcon, Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import type { ChangeEventHandler, Dispatch, FC, SetStateAction } from 'react';

import type { ApiError } from '../api/api.types';
import { getProfile, signIn, signOut, signUp } from '../api/user';
import type { User } from '../store/userData';
import { userAtom } from '../store/userData';

const handle =
  (fn: Dispatch<SetStateAction<string>>): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
  e => {
    fn(e.currentTarget.value);
  };

export const Header: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<User>('/api/user/profile')
      .then(resp => {
        console.log(resp);
        setUser(resp.data);
      })
      .catch((resp: unknown) => {
        console.log(resp);
      });
  }, [setUser]);

  const signUpHandler = async () => {
    try {
      const response = await signUp(email, password).then(getProfile);
      console.log(response.data);
      setUser(response.data);
      setDialogOpen(false);
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
      setDialogOpen(false);
    } catch (err) {
      console.log(err);
      setErrorMessage((err as AxiosError<ApiError>).response?.data.message ?? 'Unable to reach server');
    }
  };

  const logoutHandler = () => {
    signOut().then(() => {
      // even if it fails, assume no session
      setUser(null);
    });
  };

  const handleNavigate = (path: string) => () => {
    navigate({ to: `/${path}` });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton aria-label="menu" color="inherit" edge="start" size="large" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            {user != null ? (
              <>
                <IconButton
                  aria-label="menu"
                  color="inherit"
                  edge="start"
                  onClick={() => {
                    // TODO
                  }}
                  size="large"
                  sx={{ mr: 2 }}
                >
                  <PersonIcon />
                </IconButton>
                <Typography>{user.email}</Typography>
                <Button onClick={logoutHandler} variant="outlined">
                  Logout
                </Button>
              </>
            ) : (
              <IconButton
                aria-label="menu"
                color="inherit"
                edge="start"
                onClick={() => {
                  setDialogOpen(true);
                }}
                size="large"
                sx={{ mr: 2 }}
              >
                <LoginIcon />
              </IconButton>
            )}
            <Box sx={{ display: { md: 'flex', xs: 'none' }, flexGrow: 1 }}>
              <Button onClick={handleNavigate('characters')} sx={{ color: 'white', display: 'block', my: 2 }}>
                Characters
              </Button>
              <Button onClick={handleNavigate('campaigns')} sx={{ color: 'white', display: 'block', my: 2 }}>
                Campaigns
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Dialog open={dialogOpen}>
        <DialogTitle>Auth</DialogTitle>
        <DialogContent>
          <Typography>Sign Up</Typography>
          <TextField label="E-mail" onChange={handle(setEmail)} value={email} variant="outlined" />
          <TextField
            label="Password"
            onChange={handle(setPassword)}
            type="password"
            value={password}
            variant="outlined"
          />
          {errorMessage ?? <Typography component="div">{errorMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setErrorMessage(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={signUpHandler}>Sign Up</Button>
          <Button onClick={signInHandler}>Sign In</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
