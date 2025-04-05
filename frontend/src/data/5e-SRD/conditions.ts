import { indexBy } from 'ramda';

import conditionsRaw from './json/5e-SRD-Conditions.json';

export type Condition = {
  desc: string[];
  index: string;
  name: string;
  url: string;
};

export const conditions = conditionsRaw as unknown as Condition[];
export const conditionsByIndex = indexBy(m => m.index, conditions);
