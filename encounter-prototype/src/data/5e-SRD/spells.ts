import { indexBy } from 'ramda';

import type { APIReference, AreaOfEffect } from './common.types';
import spellsRaw from './json/5e-SRD-Spells.json';

type Damage = {
  damage_at_character_level?: Record<number, string>;
  damage_at_slot_level?: Record<number, string>;
  damage_type?: APIReference;
};

type DC = {
  dc_success: string;
  dc_type: APIReference;
  desc?: string;
};

export type Spell = {
  area_of_effect?: AreaOfEffect;
  attack_type?: string;
  casting_time: string;
  classes: APIReference[];
  components: string[];
  concentration: boolean;
  damage?: Damage;
  dc?: DC;
  desc: string[];
  duration: string;
  heal_at_slot_level?: Record<number, string>;
  higher_level?: string;
  index: string;
  level: number;
  material?: string;
  name: string;
  range: string;
  ritual: boolean;
  school: APIReference;
  subclasses?: APIReference[];
  url: string;
};

export const spells = spellsRaw as unknown as Spell[];
export const spellsByIndex = indexBy(m => m.index, spells);
