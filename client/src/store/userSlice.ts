import type { StateCreator } from 'zustand';

export interface User {
  displayName: string;
  email: string;
  id: string;
}

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
