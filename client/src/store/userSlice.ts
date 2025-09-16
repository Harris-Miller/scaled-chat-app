import type { StateCreator } from 'zustand';

import type { User } from '../api/user';

export interface UserSlice {
  setUser: (user: User | null) => void;
  user: User | null;
}

export const createUserSlice: StateCreator<UserSlice> = set => ({
  setUser: user => {
    set({ user });
  },
  user: null,
});
