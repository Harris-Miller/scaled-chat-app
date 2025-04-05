import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import type { FC, SyntheticEvent } from 'react';
import { match } from 'ts-pattern';

import { BackgroundSelection } from './BackgroundSelection';
import { ClassSelection } from './ClassSelection';
import { RaceSelection } from './RaceSelection';

const pages = ['race', 'background', 'class', 'abilities', 'description', 'equipment'] as const;
type Page = (typeof pages)[number];

export const CharacterCreator: FC = () => {
  const [stage, setStage] = useState<Page>('race');

  const onTabChange = (_: SyntheticEvent, newValue: Page) => {
    setStage(newValue);
  };

  const stageComponent = match(stage)
    .with('race', () => <RaceSelection />)
    .with('background', () => <BackgroundSelection />)
    .with('class', () => <ClassSelection />)
    .with('abilities', () => <Typography>TODO</Typography>)
    .with('description', () => <Typography>TODO</Typography>)
    .with('equipment', () => <Typography>TODO</Typography>)
    .exhaustive();

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs aria-label="basic tabs example" onChange={onTabChange} value={stage}>
          {pages.map(page => (
            <Tab key={page} label={page} value={page} />
          ))}
        </Tabs>
      </Box>
      {stageComponent}
    </>
  );
};
