import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { isNotNil } from 'ramda';
import { useState } from 'react';
import type { FC } from 'react';

import { backgroundsByIndex } from '../../data/5e-SRD/backgrounds';
import { proficienciesByIndex } from '../../data/5e-SRD/proficiencies';

export const BackgroundInfoBlock: FC<{ backgroundIndex: string }> = ({ backgroundIndex }) => {
  const background = backgroundsByIndex[backgroundIndex];

  return (
    <Grid container>
      <Grid size={12}>
        <Typography variant="h1">{background.name}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography component="span" sx={{ fontWeight: 'bold' }}>
          {'Skill Proficiencies: '}
        </Typography>
        {background.starting_proficiencies.map(sp => proficienciesByIndex[sp.index].reference.name).join(', ')}
      </Grid>
    </Grid>
  );
};

const backgroundIndexes = Object.keys(backgroundsByIndex);

export const BackgroundSelection: FC = () => {
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  return (
    <>
      <Grid container>
        <Grid size={12}>
          <Autocomplete
            disablePortal
            getOptionLabel={option => backgroundsByIndex[option].name}
            onChange={(_, newValue: string | null) => {
              setSelectedBackground(newValue);
            }}
            options={backgroundIndexes}
            renderInput={params => <TextField {...params} label="Background" />}
            value={selectedBackground}
          />
        </Grid>
      </Grid>
      {isNotNil(selectedBackground) ? <BackgroundInfoBlock backgroundIndex={selectedBackground} /> : null}
    </>
  );
};
