import { atomWithStorage } from 'jotai/utils';
import { uniq } from 'ramda';

import { monsters } from '../data/5e-SRD/monsters';

export const sizes = uniq(monsters.map(m => m.size));

export const creatureTypes = uniq(monsters.map(m => m.type));

export const alignments = uniq(monsters.map(m => m.alignment));

export const sizesAtom = atomWithStorage<string[]>('sizes', []);

export const creatureTypesAtom = atomWithStorage<string[]>('creatureTypes', []);

export const CR_MIN = 0;
export const CR_MAX = 30;
export const crRangeAtom = atomWithStorage<[number, number]>('crRange', [CR_MIN, CR_MAX]);
