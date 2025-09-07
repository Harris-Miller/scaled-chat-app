import { useStore as useZustandStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { UserSlice } from './userSlice';
import { createUserSlice } from './userSlice';

type ExtractState<S> = S extends { getState: () => infer X } ? X : never;

export const store = createStore<UserSlice>()((...args) => ({
  ...createUserSlice(...args),
}));

export type StoreState = ExtractState<typeof store>;

export function useStore(): StoreState;
export function useStore<T>(selector: (state: StoreState) => T): T;
export function useStore<T>(selector?: (state: StoreState) => T) {
  return useZustandStore(store, selector!);
}
