import { indexBy } from 'ramda';

import type { APIReference } from './common.types';
import rulesRaw from './json/5e-SRD-Rules.json';

export type Rule = {
  desc: string;
  index: string;
  name: string;
  subsections: APIReference[];
  url: string;
};

export const rules = rulesRaw as unknown as Rule[];
export const rulesByIndex = indexBy(m => m.index, rules);
