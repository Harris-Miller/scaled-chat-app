import { Box } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

export const DeadCenter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box alignContent="center" display="flex" justifyContent="center">
      {children}
    </Box>
  );
};
