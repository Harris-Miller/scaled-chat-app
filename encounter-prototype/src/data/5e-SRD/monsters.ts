import { indexBy } from 'ramda';

import type { APIReference, Choice, Damage, DifficultyClass } from './common.types';
import monstersRaw from './json/5e-SRD-Monsters.json';

export type ActionOption = {
  action_name: string;
  count: number | string;
  type: 'ability' | 'magic' | 'melee' | 'ranged';
};

export type ActionUsage = {
  dice?: string;
  min_value?: number;
  type: string;
};

export type Action = {
  action_options: Choice;
  actions: ActionOption[];
  attack_bonus?: number;
  damage?: Damage[];
  dc?: DifficultyClass;
  desc: string;
  multiattack_type: 'action_options' | 'actions';
  name: string;
  options?: Choice;
  usage?: ActionUsage;
};

export type ArmorClass = ArmorClassArmor | ArmorClassCondition | ArmorClassDex | ArmorClassNatural | ArmorClassSpell;

export type ArmorClassDex = {
  desc?: string;
  type: 'dex';
  value: number;
};

export type ArmorClassNatural = {
  desc?: string;
  type: 'natural';
  value: number;
};

export type ArmorClassArmor = {
  armor?: APIReference[];
  // Equipment
  desc?: string;
  type: 'armor';
  value: number;
};

export type ArmorClassSpell = {
  // Spell
  desc?: string;
  spell: APIReference;
  type: 'spell';
  value: number;
};

export type ArmorClassCondition = {
  condition: APIReference;
  // Condition
  desc?: string;
  type: 'condition';
  value: number;
};

export type LegendaryAction = {
  attack_bonus?: number;
  damage?: Damage[];
  dc?: DifficultyClass;
  desc: string;
  name: string;
};

export type Proficiency = {
  proficiency: APIReference;
  value: number;
};

export type Reaction = {
  dc?: DifficultyClass;
  desc: string;
  name: string;
};

export type Sense = {
  blindsight?: string;
  darkvision?: string;
  passive_perception: number;
  tremorsense?: string;
  truesight?: string;
};

export type SpecialAbilityUsage = {
  rest_types?: string[];
  times?: number;
  type: string;
};

export type SpecialAbilitySpell = {
  level: number;
  name: string;
  notes?: string;
  url: string;
  usage?: SpecialAbilityUsage;
};

export type SpecialAbilitySpellcasting = {
  ability: APIReference;
  components_required: string[];
  dc?: number;
  level?: number;
  modifier?: number;
  school?: string;
  slots?: Record<string, number>;
  spells: SpecialAbilitySpell[];
};

export type SpecialAbility = {
  attack_bonus?: number;
  damage?: Damage[];
  dc?: DifficultyClass;
  desc: string;
  name: string;
  spellcasting?: SpecialAbilitySpellcasting;
  usage: SpecialAbilityUsage;
};

export type Speed = {
  burrow?: string;
  climb?: string;
  fly?: string;
  hover?: string;
  swim?: string;
  walk?: string;
};

export type Monster = {
  actions?: Action[];
  alignment: string;
  armor_class: ArmorClass[];
  challenge_rating: number;
  charisma: number;
  condition_immunities: APIReference[];
  constitution: number;
  damage_immunities: string[];
  damage_resistances: string[];
  damage_vulnerabilities: string[];
  dexterity: number;
  forms?: APIReference[];
  hit_dice: string;
  hit_points: number;
  hit_points_roll: string;
  image?: string;
  index: string;
  intelligence: number;
  languages: string;
  legendary_actions?: LegendaryAction[];
  name: string;
  proficiencies: Proficiency[];
  reactions?: Reaction[];
  senses: Sense;
  size: string;
  special_abilities?: SpecialAbility[];
  speed: Speed;
  strength: number;
  subtype?: string;
  type: string;
  url: string;
  wisdom: number;
  xp: number;
};

export const monsters = monstersRaw as unknown as Monster[];

export const monstersByIndex = indexBy(m => m.index, monsters);
