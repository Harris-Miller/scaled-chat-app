import { Box, Button, Checkbox, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { append, assocPath, isEmpty, modifyPath, not, remove, sum } from 'ramda';
import type { FC } from 'react';

import { monstersByIndex } from '../data/5e-SRD/monsters';
import { useEncounterAtom } from '../store/encounterData';
import { createDefaultParty, partiesAtom } from '../store/partyData';
import type { PlayerGroup } from '../store/partyData';

const calculateEncounterDifficulties = (parties: PlayerGroup[], adjustedXp: number) => {
  const easy = sum(parties.map(party => party.level * party.numPlayers * 25));
  const medium = easy * 2;
  const hard = easy * 3;
  const deadly = easy * 4;
  const dailyBudget = sum(parties.map(party => party.level * party.numPlayers * 300));
  const difficulty = (() => {
    if (adjustedXp === 0) return 'None';
    if (adjustedXp <= easy) return 'Easy';
    if (adjustedXp <= medium) return 'Medium';
    if (adjustedXp <= hard) return 'Hard';
    return 'Deadly';
  })();

  return {
    dailyBudget,
    deadly,
    difficulty,
    easy,
    hard,
    medium,
  };
};

const calculateEncounterMultiplier = (num: number) => {
  if (num === 1) return 1;
  if (num === 2) return 1.5;
  if (num <= 6) return 2;
  if (num <= 10) return 2.5;
  if (num <= 14) return 3;
  return 4;
};

export const Left: FC = () => {
  const [parties, setParties] = useAtom(partiesAtom);
  const { encounter, decrementMonster, incrementMonster, clearEncounter } = useEncounterAtom();

  const monsterXp = sum(encounter.map(e => monstersByIndex[e.monster].xp * e.num));
  const adjustedXp = monsterXp * calculateEncounterMultiplier(sum(encounter.map(e => e.num)));

  const { easy, medium, hard, deadly, dailyBudget, difficulty } = calculateEncounterDifficulties(parties, adjustedXp);

  const addParty = () => {
    setParties(append(createDefaultParty()));
  };

  const removeParty = (i: number) => {
    setParties(remove(i, 1));
  };

  const updateNumPlayers = (i: number, value: number) => {
    // mantine types value as `number | string` but we know it's always a number, so safe to cast
    setParties(assocPath([i, 'numPlayers'], value));
  };

  const updateLevel = (i: number, value: number) => {
    // mantine types value as `number | string` but we know it's always a number, so safe to cast
    setParties(assocPath([i, 'level'], value));
  };

  const toggleXp = (i: number) => {
    // ramda's modifyPath is not typed for currying yet
    setParties(p => modifyPath([i, 'xp'], not, p));
  };

  return (
    <>
      <Grid container>
        <Grid size={7}>
          <Grid>
            <Grid>Party</Grid>
            <Grid container>
              <Grid size={3}>Players</Grid>
              <Grid size={2} />
              <Grid size={3}>Level</Grid>
              <Grid size={2}>XP</Grid>
              <Grid size={2} />
            </Grid>
            {parties.map((party, i) => (
              <Grid container key={party.id}>
                <Grid size={3}>
                  <TextField
                    onChange={e => {
                      updateNumPlayers(i, Number.parseInt(e.target.value, 10));
                    }}
                    type="number"
                    value={party.numPlayers}
                  />
                </Grid>
                <Grid alignItems="center" display="flex" justifyContent="center" size={2}>
                  X
                </Grid>
                <Grid size={3}>
                  <TextField
                    onChange={e => {
                      updateLevel(i, Number.parseInt(e.target.value, 10));
                    }}
                    type="number"
                    value={party.level}
                  />
                </Grid>
                <Grid alignItems="center" display="flex" justifyContent="center" size={2}>
                  <Checkbox
                    checked={party.xp}
                    onChange={() => {
                      toggleXp(i);
                    }}
                  />
                </Grid>
                <Grid alignItems="center" display="flex" justifyContent="center" size={2}>
                  <Button
                    onClick={() => {
                      removeParty(i);
                    }}
                    size="small"
                    sx={{ minWidth: 0 }}
                    variant="outlined"
                  >
                    X
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Grid>
              <Button onClick={addParty}>+ Add Generic Group</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={5}>
          <Stack>
            <Typography>XP Goals</Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography>Easy</Typography>
              <Typography>{easy}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Medium</Typography>
              <Typography>{medium}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Hard</Typography>
              <Typography>{hard}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Deadly</Typography>
              <Typography>{deadly}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Daily budget</Typography>
              <Typography>{dailyBudget}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Divider />
      <Grid container>
        <Grid size={12}>Encounter</Grid>
      </Grid>
      <Divider />
      {encounter.map(({ key, monster, num }, i) => (
        <Grid container key={key}>
          <Grid size={9}>{monster}</Grid>
          <Grid size={3}>
            <Button
              onClick={() => {
                incrementMonster(i);
              }}
              sx={{ minWidth: 0 }}
              variant="outlined"
            >
              +
            </Button>
            {num}
            <Button
              onClick={() => {
                decrementMonster(i);
              }}
              sx={{ minWidth: 0 }}
              variant="outlined"
            >
              {num === 1 ? 'X' : '-'}
            </Button>
          </Grid>
        </Grid>
      ))}
      {!isEmpty(encounter) ? <Button onClick={clearEncounter}>X Clean Encounter</Button> : null}
      <Divider />
      <Box display="flex" justifyContent="space-between">
        <Typography>Difficulty</Typography>
        <Typography>{difficulty}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>Total XP</Typography>
        <Typography>{monsterXp}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>Adjusted XP</Typography>
        <Typography>{adjustedXp}</Typography>
      </Box>
    </>
  );
};
