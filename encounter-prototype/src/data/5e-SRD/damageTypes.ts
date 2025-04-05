import { indexBy } from 'ramda';

import damageTypesRaw from './json/5e-SRD-Damage-Types.json';

export type DamageType = {
  desc: string[];
  index: string;
  name: string;
  url: string;
};

export const damageTypes = damageTypesRaw as unknown as DamageType[];
export const damageTypesByIndex = indexBy(m => m.index, damageTypes);
