import { Grid } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

import { LoginDialog } from '../components/Login';
import { useStore } from '../store';

import { LandingPage } from './-landingPage';

const IndexComponent: FC = () => {
  const { user } = useStore();

  return (
    <Grid container>
      <Grid size={12}>{user == null ? <LoginDialog open /> : <LandingPage />}</Grid>
    </Grid>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
