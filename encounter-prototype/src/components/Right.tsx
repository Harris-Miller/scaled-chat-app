import { Autocomplete, Button, Grid, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { isEmpty, range } from 'ramda';
import type { FC } from 'react';

import {
  alignments,
  CR_MAX,
  CR_MIN,
  creatureTypes,
  creatureTypesAtom,
  crRangeAtom,
  sizes,
  sizesAtom,
} from '../store/monsterSearch';

export const Right: FC = () => {
  const [selectedSizes, setSelectedSizes] = useAtom(sizesAtom);
  const [selectedCreatureTypes, setSelectedCreatureTypes] = useAtom(creatureTypesAtom);
  const [[crLow, crHigh], setCrRange] = useAtom(crRangeAtom);

  const resetDisabled =
    isEmpty(selectedSizes) && isEmpty(selectedCreatureTypes) && crLow === CR_MIN && crHigh === CR_MAX;

  const onReset = () => {
    setSelectedSizes([]);
    setSelectedCreatureTypes([]);
    setCrRange([CR_MIN, CR_MAX]);
  };

  return (
    <Grid container>
      <Grid size={6}>
        <Button variant="contained">Manage Resources</Button>
      </Grid>
      <Grid size={6}>
        <Button disabled={resetDisabled} onClick={onReset} variant="outlined">
          Reset Filters
        </Button>
      </Grid>
      <Grid size={12}>
        <Typography>&quot;Challenge Rating&quot;</Typography>
      </Grid>
      <Grid size={12}>
        <Slider
          disableSwap
          max={30}
          min={0}
          onChange={(_, value) => {
            setCrRange(value as [number, number]);
          }}
          value={[crLow, crHigh]}
        />
        <Grid container>
          <Grid size={4}>
            <Select
              fullWidth
              onChange={e => {
                setCrRange([e.target.value as number, crHigh]);
              }}
              value={crLow}
            >
              {range(0, crHigh).map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid alignItems="center" display="flex" justifyContent="center" size={4}>
            <Typography>{'<= CR <='}</Typography>
          </Grid>
          <Grid size={4}>
            <Select
              fullWidth
              onChange={e => {
                setCrRange([crLow, e.target.value as number]);
              }}
              value={crHigh}
            >
              {range(crLow + 1, 31).map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Autocomplete
          multiple
          onChange={(_, nextValue) => {
            setSelectedSizes(nextValue);
          }}
          options={sizes}
          renderInput={params => (
            <TextField {...params} label="Size category" placeholder="Any size" variant="standard" />
          )}
          value={selectedSizes}
        />
      </Grid>
      <Grid size={12}>
        <Autocomplete
          multiple
          onChange={(_, nextValue) => {
            setSelectedCreatureTypes(nextValue);
          }}
          options={creatureTypes}
          renderInput={params => (
            <TextField {...params} label="Creature type" placeholder="Any type" variant="standard" />
          )}
          value={selectedCreatureTypes}
        />
      </Grid>
      <Grid size={12}>
        <Autocomplete
          multiple
          options={alignments}
          // onChange={(_, nextValue) => setSelectedCreatureTypes(nextValue)}
          // value={selectedCreatureTypes}
          renderInput={params => (
            <TextField {...params} label="Creature Alignment" placeholder="Any alignment" variant="standard" />
          )}
        />
      </Grid>
    </Grid>
  );
};
