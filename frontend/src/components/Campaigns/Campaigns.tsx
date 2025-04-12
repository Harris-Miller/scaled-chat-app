import { Grid, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

import { useCampaigns } from '../../api/campaigns';

export const Campaigns: FC = () => {
  const campaigns = useCampaigns();

  return (
    <Grid container>
      <Grid size={12}>
        <Typography variant="h1">Campaigns</Typography>
      </Grid>
      <Grid size={12}>
        {(() => {
          if (campaigns.isPending) {
            return <div>Loading...</div>;
          }
          if (campaigns.isError) {
            return <div>Error</div>;
          }
          return campaigns.data.campaigns.map(c => (
            <div key={c.id}>
              <Link params={{ campaignId: c.id }} to="/campaigns/$campaignId">
                {c.name}
              </Link>
            </div>
          ));
        })()}
      </Grid>
    </Grid>
  );
};
