import { Menu as MenuIcon } from '@mui/icons-material';
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
import { useState } from 'react';
import type { ChangeEventHandler, Dispatch, FC, SetStateAction } from 'react';

const handle =
  (fn: Dispatch<SetStateAction<string>>): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
  e => {
    fn(e.currentTarget.value);
  };

export const Header: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);

  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data }) => {
  //     setSession(data.session);
  //   });

  //   supabase.auth.onAuthStateChange((_event, s) => {
  //     // console.log('session updated', s);
  //     setSession(s);
  //   });
  // }, []);

  const login = () => {
    // noop for now
    // console.log(`Signing in with ${email} / ${password}`);
    // supabase.auth
    //   .signInWithPassword({ email, password })
    //   .then(({ error: signInError }) => {
    //     if (signInError) {
    //       throw signInError;
    //     }
    //     setDialogOpen(false);
    //   })
    //   .catch((e: unknown) => {
    //     const err = e as Error;
    //     console.error(err);
    //     setError(err);
    //   });
  };

  // const logout = () => {
  //   supabase.auth.signOut();
  // };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton aria-label="menu" color="inherit" edge="start" size="large" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            {/* {session ? (
              <>
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
                  <PersonIcon />
                </IconButton>
                <Typography>{session.user.email}</Typography>
                <Button onClick={logout} variant="outlined">
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
            )} */}
          </Toolbar>
        </AppBar>
      </Box>
      <Dialog open={dialogOpen}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField label="E-mail" onChange={handle(setEmail)} value={email} variant="outlined" />
          <TextField
            label="Password"
            onChange={handle(setPassword)}
            type="password"
            value={password}
            variant="outlined"
          />
          {error ? <Typography>{error.message}</Typography> : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setError(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={login}>Login</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
