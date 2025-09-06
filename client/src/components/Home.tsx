import { Grid, Typography } from '@mui/material';
import type { FC } from 'react';

export const Home: FC = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <Typography variant="h1">Home</Typography>
      </Grid>
    </Grid>
  );
};
