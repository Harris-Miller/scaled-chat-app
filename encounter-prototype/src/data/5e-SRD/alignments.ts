import { indexBy } from 'ramda';

import alignmentsRaw from './json/5e-SRD-Alignments.json';

export type Alignment = {
  abbreviation: string;
  desc: string;
  index: string;
  name: string;
  url: string;
};

export const alignments = alignmentsRaw as unknown as Alignment[];
export const alignmentsByIndex = indexBy(m => m.index, alignments);
