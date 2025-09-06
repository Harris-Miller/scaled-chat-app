import { indexBy } from 'ramda';

import magicSchoolsRaw from './json/5e-SRD-Magic-Schools.json';

export type MagicSchool = {
  desc: string;
  index: string;
  name: string;
  url: string;
};

export const magicSchools = magicSchoolsRaw as unknown as MagicSchool[];
export const magicSchoolsByIndex = indexBy(m => m.index, magicSchools);
