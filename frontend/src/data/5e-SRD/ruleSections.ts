import { indexBy } from 'ramda';

import ruleSectionsRaw from './json/5e-SRD-Rule-Sections.json';

export type RuleSection = {
  desc: string;
  index: string;
  name: string;
  url: string;
};

export const ruleSections = ruleSectionsRaw as unknown as RuleSection[];
export const ruleSectionsByIndex = indexBy(m => m.index, ruleSections);
