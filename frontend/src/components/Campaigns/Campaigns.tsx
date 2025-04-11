import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import type { FC } from 'react';

import { getCampaigns } from '../../api/campaigns';

export const Campaigns: FC = () => {
  useEffect(() => {
    getCampaigns().then(result => {
      console.log(result);
    });
  }, []);

  return (
    <Grid container>
      <Grid size={12}>
        <Typography variant="h1">Campaigns</Typography>
      </Grid>
    </Grid>
  );
};
