import { indexBy } from 'ramda';

import weaponPropertiesRaw from './json/5e-SRD-Weapon-Properties.json';

export type WeaponProperty = {
  desc: string[];
  index: string;
  name: string;
  url: string;
};

export const weaponProperties = weaponPropertiesRaw as unknown as WeaponProperty[];
export const weaponPropertiesByIndex = indexBy(m => m.index, weaponProperties);
