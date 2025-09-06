import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import equipmentRaw from './json/5e-SRD-Equipment.json';

type ArmorClass = {
  base: number;
  dex_bonus: boolean;
  max_bonus?: number;
};

type Content = {
  item: APIReference;
  quantity: number;
};

type Cost = {
  quantity: number;
  unit: string;
};

type Damage = {
  damage_dice: string;
  damage_type: APIReference;
};

type Range = {
  long?: number;
  normal: number;
};

type Speed = {
  quantity: number;
  unit: string;
};

type ThrowRange = {
  long: number;
  normal: number;
};

type TwoHandedDamage = {
  damage_dice: string;
  damage_type: APIReference;
};

export type Equipment = {
  armor_category?: string;
  armor_class?: ArmorClass;
  capacity?: number;
  category_range?: string;
  contents?: Content[];
  cost: Cost;
  damage?: Damage;
  desc: string[];
  equipment_category: APIReference;
  gear_category?: APIReference;
  index: string;
  name: string;
  properties?: APIReference[];
  quantity?: number;
  range?: Range;
  special?: string[];
  speed?: Speed;
  stealth_disadvantage?: boolean;
  str_minimum?: number;
  throw_range?: ThrowRange;
  tool_category?: string;
  two_handed_damage?: TwoHandedDamage;
  url: string;
  vehicle_category?: string;
  weapon_category?: string;
  weapon_range?: string;
  weight?: number;
};

export const equipment = equipmentRaw as unknown as Equipment[];
export const equipmentByIndex = indexBy(m => m.index, equipment);
