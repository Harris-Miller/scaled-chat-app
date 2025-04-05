import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { append, dec, inc, modifyPath, remove } from 'ramda';

export type EncounterGroup = {
  key: string;
  monster: string;
  num: number;
};

const encounterAtom = atomWithStorage<EncounterGroup[]>('encounter', []);

export const useEncounterAtom = () => {
  const [encounter, setEncounter] = useAtom(encounterAtom);

  const addMonster = (monster: string) => {
    setEncounter(append({ key: nanoid(), monster, num: 1 }));
  };

  const incrementMonster = (i: number) => {
    setEncounter(e => modifyPath([i, 'num'], inc, e));
  };

  const decrementMonster = (i: number) => {
    setEncounter(e => (e[i].num === 1 ? remove(i, 1, e) : modifyPath([i, 'num'], dec, e)));
  };

  const clearEncounter = () => {
    setEncounter([]);
  };

  return {
    addMonster,
    clearEncounter,
    decrementMonster,
    encounter,
    incrementMonster,
  };
};
