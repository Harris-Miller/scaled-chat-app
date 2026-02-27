import ChatIcon from '@mui/icons-material/Chat';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { AppBar, ButtonGroup, IconButton, Popover, Toolbar, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useState } from 'react';
import type { FC, MouseEvent } from 'react';
import { match } from 'ts-pattern';

export const Header: FC = () => {
  const { mode, setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
          <ChatIcon /> Scaled Chat App
        </Typography>
        <IconButton color="inherit" onClick={handleClick}>
          {match(mode!)
            .with('light', () => <LightModeIcon />)
            .with('system', () => <SettingsBrightnessIcon />)
            .with('dark', () => <DarkModeIcon />)
            .exhaustive()}
        </IconButton>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          onClose={handleClose}
          open={open}
          transformOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          <ButtonGroup aria-label="Basic button group" variant="contained">
            <IconButton
              onClick={() => {
                setMode('light');
              }}
            >
              <LightModeIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setMode('system');
              }}
            >
              <SettingsBrightnessIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setMode('dark');
              }}
            >
              <DarkModeIcon />
            </IconButton>
          </ButtonGroup>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

// export const Header: FC = () => {
//   return (
//     <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
//       <Toolbar>
//         <IconButton
//           aria-label="menu"
//           color="inherit"
//           edge="start"
//           onClick={() => navigate({ to: '/' })}
//           size="large"
//           sx={{ mr: 2 }}
//         >
//           <MenuIcon />
//         </IconButton>
//         <Typography component="div" sx={{ flexGrow: 1 }} variant="h1">
//           Scaled Chat App
//         </Typography>
//         {user != null && (
//           <>
//             <IconButton aria-label="menu" color="inherit" edge="start" onClick={handleMenu} size="large" sx={{ mr: 2 }}>
//               {user.profilePicId != null ? (
//                 <Avatar alt="Profile" src={`/api/user/profile/pic/${user.profilePicId}/thumb`} />
//               ) : (
//                 <PersonIcon />
//               )}
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//               id="menu-appbar"
//               onClose={handleClose}
//               open={Boolean(anchorEl)}
//             >
//               <ListSubheader>
//                 {user.displayName} ({user.email})
//               </ListSubheader>
//               <Divider />
//               <MenuItem onClick={profileHandler}>Profile</MenuItem>
//               <MenuItem onClick={logoutHandler}>Logout</MenuItem>
//             </Menu>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };
