import { Box } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

export const AppMount: FC<PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'absolute',
      width: '100%',
    }}
  >
    {children}
  </Box>
);
