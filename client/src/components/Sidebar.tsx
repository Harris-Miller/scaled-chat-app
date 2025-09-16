import { Box, Drawer, Toolbar } from '@mui/material';
import type { FC } from 'react';

const drawerWidth = 360;

export const Sidebar: FC = () => {
  return (
    <Drawer
      sx={{
        [`& .MuiDrawer-paper`]: { boxSizing: 'border-box', width: drawerWidth },
        flexShrink: 0,
        width: drawerWidth,
      }}
      variant="permanent"
    >
      {/* Empty <Toolbar /> is here to add the height of the AppBar */}
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>Todo</Box>
    </Drawer>
  );
};
