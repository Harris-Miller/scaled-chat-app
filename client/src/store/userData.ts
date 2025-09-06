import { atom } from 'jotai';

export type User = {
  email: string;
};

export const userAtom = atom<User | null>(null);
