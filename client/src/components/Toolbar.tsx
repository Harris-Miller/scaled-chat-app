import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Box, Flex, TextField } from '@radix-ui/themes';
import type { FC } from 'react';

import './toolbar.css';

export const Toolbar: FC = () => {
  return (
    <Box className="toolbar">
      <Flex>
        <Flex align="center">
          <HamburgerMenuIcon />
        </Flex>
        <Flex flexGrow="1" justify="center">
          <Box minWidth="400px">
            <TextField.Root placeholder="Search (not yet implemented)">
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
        </Flex>
      </Flex>
    </Box>
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
