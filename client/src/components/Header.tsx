import { Login as LoginIcon, Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import type { ChangeEventHandler, Dispatch, FC, MouseEvent, SetStateAction } from 'react';

import type { ApiError } from '../api/api.types';
import { getProfile, signIn, signOut, signUp } from '../api/user';
import { useStore } from '../store';

const handle =
  (fn: Dispatch<SetStateAction<string>>): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
  e => {
    fn(e.currentTarget.value);
  };

export const Header: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(resp => {
        console.log(resp.data);
        setUser(resp.data);
      })
      .catch((resp: unknown) => {
        console.log(resp);
      });
  }, [setUser]);

  const signUpHandler = async () => {
    try {
      const response = await signUp(email, password).then(getProfile);
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

  const profileHandler = () => {
    navigate({ to: '/profile' });
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton aria-label="menu" color="inherit" edge="start" size="large" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
              Scaled Chat App
            </Typography>
            {user != null ? (
              <>
                <IconButton
                  aria-label="menu"
                  color="inherit"
                  edge="start"
                  onClick={handleMenu}
                  size="large"
                  sx={{ mr: 2 }}
                >
                  {user.profilePicId != null ? (
                    <Avatar alt="Profile" src={`/api/user/profile/pic/${user.profilePicId}/thumb`} />
                  ) : (
                    <PersonIcon />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  id="menu-appbar"
                  onClose={handleClose}
                  open={Boolean(anchorEl)}
                >
                  <ListSubheader>
                    {user.displayName} ({user.email})
                  </ListSubheader>
                  <Divider />
                  <MenuItem onClick={profileHandler}>Profile</MenuItem>
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
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
