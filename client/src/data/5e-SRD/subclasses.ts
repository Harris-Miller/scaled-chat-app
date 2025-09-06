import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import subclassesRaw from './json/5e-SRD-Subclasses.json';

type SpellPrerequisite = {
  index: string;
  name: string;
  type: string;
  url: string;
};

type Spell = {
  prerequisites: SpellPrerequisite[];
  spell: APIReference;
};

export type Subclass = {
  class: APIReference;
  desc: string[];
  index: string;
  name: string;
  spells?: Spell[];
  subclass_flavor: string;
  subclass_levels: string;
  url: string;
};

export const subclasses = subclassesRaw as unknown as Subclass[];
export const subclassesByIndex = indexBy(m => m.index, subclasses);
