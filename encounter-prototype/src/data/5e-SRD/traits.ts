import { indexBy } from 'ramda';

import type { APIReference, AreaOfEffect, Choice, DifficultyClass } from './common.types';
import traitsRaw from './json/5e-SRD-Traits.json';

export type Proficiency = {
  index: string;
  name: string;
  url: string;
};

export type ActionDamage = {
  damage_at_character_level: Record<string, string>;
  damage_type: APIReference;
};

export type Usage = {
  times: number;
  type: string;
};

export type Action = {
  area_of_effect: AreaOfEffect;
  damage: ActionDamage[];
  dc: DifficultyClass;
  desc: string;
  name: string;
  usage: Usage;
};

export type TraitSpecific = {
  breath_weapon?: Action;
  damage_type?: APIReference;
  spell_options?: Choice;
  subtrait_options?: Choice;
};

export type Trait = {
  desc: string[];
  index: string;
  language_options?: Choice;
  name: string;
  parent?: APIReference;
  proficiencies?: APIReference[];
  proficiency_choices?: Choice;
  races?: APIReference[];
  subraces?: APIReference[];
  trait_specific?: TraitSpecific;
  url: string;
};

export const traits = traitsRaw as unknown as Trait[];
export const traitsByIndex = indexBy(m => m.index, traits);
