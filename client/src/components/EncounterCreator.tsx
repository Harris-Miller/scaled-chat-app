import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { isEmpty } from 'ramda';
import { useMemo, useState } from 'react';
import type { FC } from 'react';

import { monsters } from '../data/5e-SRD/monsters';
import type { Monster } from '../data/5e-SRD/monsters';
import { useEncounterAtom } from '../store/encounterData';
import { creatureTypesAtom, crRangeAtom, sizesAtom } from '../store/monsterSearch';

import { Left } from './Left';
import { Right } from './Right';

export const EncounterCreator: FC = () => {
  const selectedSizes = useAtomValue(sizesAtom);
  const selectedCreatureTypes = useAtomValue(creatureTypesAtom);
  const [crLow, crHigh] = useAtomValue(crRangeAtom);
  const [value, setValue] = useState('');
  const { addMonster } = useEncounterAtom();

  const filtered = useMemo(() => {
    let results: Monster[] = monsters;

    if (!isEmpty(selectedSizes)) {
      results = results.filter(m => selectedSizes.includes(m.size));
    }
    if (!isEmpty(selectedCreatureTypes)) {
      results = results.filter(m => selectedCreatureTypes.includes(m.type));
    }

    results = results.filter(m => crLow <= m.challenge_rating && m.challenge_rating <= crHigh);

    const valueL = value.toLowerCase();
    return results.filter(m => m.name.toLowerCase().includes(valueL));
  }, [value, selectedSizes, selectedCreatureTypes, crLow, crHigh]);

  const rows = filtered.map(m => (
    <TableRow key={m.name}>
      <TableCell>
        <Button
          onClick={() => {
            addMonster(m.index);
          }}
        >
          Add
        </Button>
      </TableCell>
      <TableCell>{m.name}</TableCell>
      <TableCell>{m.alignment}</TableCell>
      <TableCell>{m.size}</TableCell>
      <TableCell>{m.type}</TableCell>
      <TableCell>{m.challenge_rating}</TableCell>
    </TableRow>
  ));

  return (
    <Grid container>
      <Grid size={3}>
        <Left />
      </Grid>
      <Grid size={6}>
        <Grid container>
          <Grid size={9}>
            <TextField
              fullWidth
              onChange={e => {
                setValue(e.currentTarget.value);
              }}
              value={value}
              variant="outlined"
            />
          </Grid>
          <Grid size={3}>
            <Typography>
              Number of Monsters:
              {rows.length}
            </Typography>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Alignment</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>CR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </Grid>
      <Grid size={3}>
        <Right />
      </Grid>
    </Grid>
  );
};
