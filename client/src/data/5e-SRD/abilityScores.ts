import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import abilityScoresRaw from './json/5e-SRD-Ability-Scores.json';

export type AbilityScore = {
  desc: string[];
  full_name: string;
  index: string;
  name: string;
  skills: APIReference[];
  url: string;
};

export const abilityScores = abilityScoresRaw as unknown as AbilityScore[];
export const abilityScoresByIndex = indexBy(m => m.index, abilityScores);
