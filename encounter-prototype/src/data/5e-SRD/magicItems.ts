import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import magicItemsRaw from './json/5e-SRD-Magic-Items.json';

type Rarity = {
  name: string;
};

export type MagicItem = {
  desc: string[];
  equipment_category: APIReference;
  index: string;
  name: string;
  rarity: Rarity;
  url: string;
  variant: boolean;
  variants: APIReference[];
};

export const magicItems = magicItemsRaw as unknown as MagicItem[];
export const magicItemsByIndex = indexBy(m => m.index, magicItems);
