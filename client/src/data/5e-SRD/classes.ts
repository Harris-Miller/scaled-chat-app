import { indexBy } from 'ramda';

import type { APIReference, Choice } from './common.types';
import classesRaw from './json/5e-SRD-Classes.json';

export type Equipment = {
  equipment: APIReference;
  quantity: number;
};

export type StartingEquipmentOption = {
  equipment: APIReference;
  quantity: number;
};

export type SpellcastingInfo = {
  desc: string[];
  name: string;
};

export type Spellcasting = {
  info: SpellcastingInfo[];
  level: number;
  spellcasting_ability: APIReference;
};

export type MultiClassingPrereq = {
  ability_score: APIReference;
  minimum_score: number;
};

export type MultiClassing = {
  prerequisite_options?: Choice;
  prerequisites?: MultiClassingPrereq[];
  proficiencies?: APIReference[];
  proficiency_choices?: Choice[];
};

export type Class = {
  // this is a urlLink, unneeded
  // class_levels: string;
  hit_die: number;
  index: string;
  multi_classing: MultiClassing;
  name: string;
  proficiencies: APIReference[];
  proficiency_choices: Choice[];
  saving_throws: APIReference[];
  spellcasting?: Spellcasting;
  spells?: string;
  starting_equipment?: Equipment[];
  starting_equipment_options: Choice[];
  subclasses: APIReference[];
  url: string;
};

export const classes = classesRaw as unknown as Class[];
export const classesByIndex = indexBy(m => m.index, classes);
