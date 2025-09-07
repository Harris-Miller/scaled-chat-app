import { Grid } from '@mui/material';
import type { FC } from 'react';

import { useStore } from '../../store';
import { LoginDialog } from '../Login';

import { LandingPage } from './LandingPage';

export const Home: FC = () => {
  const { user } = useStore();

  return (
    <Grid container>
      <Grid size={12}>{user == null ? <LoginDialog open /> : <LandingPage />}</Grid>
    </Grid>
  );
};
