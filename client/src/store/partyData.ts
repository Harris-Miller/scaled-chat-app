import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';

export type PlayerGroup = {
  id: string;
  level: number;
  numPlayers: number;
  xp: boolean;
};

export const createDefaultParty = (): PlayerGroup => ({ id: nanoid(), level: 1, numPlayers: 4, xp: true });

export const partiesAtom = atomWithStorage<PlayerGroup[]>('parties', [createDefaultParty()]);
