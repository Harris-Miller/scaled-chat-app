import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import skillsRaw from './json/5e-SRD-Skills.json';

export type Skill = {
  ability_score: APIReference;
  desc: string[];
  index: string;
  name: string;
  url: string;
};

export const skills = skillsRaw as unknown as Skill[];
export const skillsByIndex = indexBy(m => m.index, skills);
