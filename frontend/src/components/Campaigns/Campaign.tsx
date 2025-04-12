import { Grid, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import type { FC } from 'react';

import { useCampaign } from '../../api/campaigns';

export const Campaign: FC = () => {
  const { campaignId } = useParams({ from: '/campaigns/$campaignId' });
  const campaign = useCampaign(campaignId);

  if (campaign.isPending) {
    return (
      <Grid container>
        <Grid size={12}>Loading...</Grid>
      </Grid>
    );
  }

  if (campaign.isSuccess) {
    return (
      <Grid container>
        <Grid size={12}>
          <Typography variant="h1">{campaign.data.name}</Typography>
        </Grid>
        <Grid size={12} />
      </Grid>
    );
  }

  // isError
  return (
    <Grid container>
      <Grid size={12}>Error</Grid>
    </Grid>
  );
};
