import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import type { FC } from 'react';

import { raceByIndex, races } from '../../data/5e-SRD/races';

// TODO
// * Race
// * Race Specific Choices
// * Class
// * Level choices
// * Ability scores
// * Background

const RaceInfoBlock: FC<{ raceIndex: string }> = ({ raceIndex }) => {
  const race = raceByIndex[raceIndex];

  return (
    <Grid container>
      <Typography variant="h1">{race.name}</Typography>
      <Grid size={12}>
        <Typography variant="h4">Size: {race.size}</Typography>
        <Typography>{race.size_description}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Alignment</Typography>
        <Typography>{race.alignment}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Age</Typography>
        <Typography>{race.age}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Speed: {race.speed}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography>{race.language_desc}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Ability Bonuses</Typography>
        {race.ability_bonuses.map((bonus, i) => (
          // this array is static, ok to use `key={i}`
          // eslint-disable-next-line react/no-array-index-key
          <Grid container key={i}>
            <Grid size={12}>
              <Typography>
                {bonus.ability_score.name} +{bonus.bonus}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Starting Proficiencies</Typography>
        {(race.starting_proficiencies ?? []).map(sp => (
          <Grid container key={sp.index}>
            <Grid size={12}>
              <Typography>{sp.name}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Subrace</Typography>
        {(race.subraces ?? []).map(sr => (
          <Grid container key={sr.index}>
            <Grid size={12}>
              <Typography>{sr.name}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Traits</Typography>
        {(race.traits ?? []).map(trait => (
          <Grid container key={trait.index}>
            <Grid size={12}>
              <Typography>{trait.name}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export const RaceSelection: FC = () => {
  const [selectedRace, setSelectedRace] = useState(races[0].index);

  return (
    <>
      <Grid container>
        {races.map(race => (
          <Grid key={race.index} size={12}>
            <Button
              onClick={() => {
                setSelectedRace(race.index);
              }}
            >
              {race.name}
            </Button>
          </Grid>
        ))}
      </Grid>
      <RaceInfoBlock raceIndex={selectedRace} />
      <Button>Next</Button>
    </>
  );
};
