import { indexBy } from 'ramda';

import type { APIReference, Choice } from './common.types';
import featuresRaw from './json/5e-SRD-Features.json';

type Prerequisite = FeaturePrerequisite | LevelPrerequisite | SpellPrerequisite;

type LevelPrerequisite = {
  level: number;
  type: string;
};

type FeaturePrerequisite = {
  feature: string;
  type: string;
};

type SpellPrerequisite = {
  spell: string;
  type: string;
};

type FeatureSpecific = {
  expertise_options?: Choice;
  invocations?: APIReference[];
  subfeature_options?: Choice;
};

export type Feature = {
  class: APIReference;
  desc: string[];
  feature_specific?: FeatureSpecific;
  index: string;
  level: number;
  name: string;
  parent?: APIReference;
  prerequisites?: Prerequisite[];
  reference?: string;
  subclass?: APIReference;
  url: string;
};

export const features = featuresRaw as unknown as Feature[];
export const featuresByIndex = indexBy(m => m.index, features);
