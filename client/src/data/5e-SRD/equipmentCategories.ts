import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import equipmentCategoriesRaw from './json/5e-SRD-Equipment-Categories.json';

export type EquipmentCategory = {
  equipment: APIReference[];
  index: string;
  name: string;
  url: string;
};

export const equipmentCategories = equipmentCategoriesRaw as unknown as EquipmentCategory[];
export const equipmentCategoriesByIndex = indexBy(m => m.index, equipmentCategories);
