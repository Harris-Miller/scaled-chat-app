import { Box, Container } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { Header } from './Header';

export const AppWrapper: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Header />

    <Box
      component="main"
      sx={{
        backgroundColor: theme => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Container maxWidth={false}>{children}</Container>
    </Box>
  </>
);
