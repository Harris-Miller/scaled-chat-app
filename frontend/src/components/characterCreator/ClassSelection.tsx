import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import type { FC } from 'react';

import { classes, classesByIndex } from '../../data/5e-SRD/classes';

export const ClassInfoBlock: FC<{ classIndex: string }> = ({ classIndex }) => {
  const dndClass = classesByIndex[classIndex];

  return (
    <Grid container>
      <Grid size={12}>
        <Typography variant="h1">{dndClass.name}</Typography>
        <Grid size={12}>
          <Typography variant="h4">Hit Die: d{dndClass.hit_die}</Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="h4">Proficiencies</Typography>
          {dndClass.proficiencies.map(prof => (
            <Typography key={prof.index}>{prof.name}</Typography>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export const ClassSelection: FC = () => {
  const [selectedClass, setSelectedClass] = useState(classes[0].index);

  return (
    <>
      <Grid container>
        {classes.map(dndClass => (
          <Grid key={dndClass.index} size={12}>
            <Button
              onClick={() => {
                setSelectedClass(dndClass.index);
              }}
            >
              {dndClass.name}
            </Button>
          </Grid>
        ))}
      </Grid>
      <ClassInfoBlock classIndex={selectedClass} />
    </>
  );
};
