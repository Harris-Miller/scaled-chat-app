import { Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import { AppBar, Avatar, Divider, IconButton, ListSubheader, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { FC, MouseEvent } from 'react';

import { getProfile, signOut } from '../api/user';
import { useStore } from '../store';

export const Header: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(resp => {
        setUser(resp.data);
      })
      .catch((_resp: unknown) => {
        // TODO
      });
  }, [setUser]);

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
    <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton aria-label="menu" color="inherit" edge="start" size="large" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography component="div" sx={{ flexGrow: 1 }} variant="h1">
          Scaled Chat App
        </Typography>
        {user != null && (
          <>
            <IconButton aria-label="menu" color="inherit" edge="start" onClick={handleMenu} size="large" sx={{ mr: 2 }}>
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
        )}
      </Toolbar>
    </AppBar>
  );
};
