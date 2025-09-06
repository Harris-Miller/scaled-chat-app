import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import featsRaw from './json/5e-SRD-Feats.json';

type Prerequisite = {
  ability_score: APIReference;
  minimum_score: number;
};

export type Feat = {
  desc: string[];
  index: string;
  name: string;
  prerequisites: Prerequisite[];
  url: string;
};

export const feats = featsRaw as unknown as Feat[];
export const featsByIndex = indexBy(m => m.index, feats);
