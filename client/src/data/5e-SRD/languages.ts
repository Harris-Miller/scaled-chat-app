import { indexBy } from 'ramda';

import languagesRaw from './json/5e-SRD-Languages.json';

export type Language = {
  desc?: string;
  index: string;
  name: string;
  script?: string;
  type: string;
  typical_speakers: string[];
  url: string;
};

export const languages = languagesRaw as unknown as Language[];
export const languagesByIndex = indexBy(m => m.index, languages);
