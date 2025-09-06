import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import type { FC } from 'react';

import { getCharacters } from '../api/characters';

export const Characters: FC = () => {
  useEffect(() => {
    getCharacters().then(result => {
      console.log(result);
    });
  }, []);

  return (
    <Grid container>
      <Grid size={12}>
        <Typography variant="h1">Characters</Typography>
      </Grid>
    </Grid>
  );
};
