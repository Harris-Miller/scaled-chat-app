import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import proficienciesRaw from './json/5e-SRD-Proficiencies.json';

type Reference = {
  index: string;
  name: string;
  type: string;
  url: string;
};

export type Proficiency = {
  classes?: APIReference[];
  index: string;
  name: string;
  races?: APIReference[];
  reference: Reference;
  type: string;
  url: string;
};

export const proficiencies = proficienciesRaw as unknown as Proficiency[];
export const proficienciesByIndex = indexBy(m => m.index, proficiencies);
