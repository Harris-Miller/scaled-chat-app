import { indexBy } from 'ramda';

import type { APIReference, Choice } from './common.types';
import subracesRaw from './json/5e-SRD-Subraces.json';

type AbilityBonus = {
  ability_score: APIReference;
  bonus: number;
};

export type Subrace = {
  ability_bonuses: AbilityBonus[];
  desc: string;
  index: string;
  language_options?: Choice;
  name: string;
  race: APIReference;
  racial_traits: APIReference[];
  starting_proficiencies?: APIReference[];
  url: string;
};

export const subraces = subracesRaw as unknown as Subrace[];
export const subracesByIndex = indexBy(m => m.index, subraces);
