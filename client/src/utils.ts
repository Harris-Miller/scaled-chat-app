import type { ChangeEventHandler, Dispatch, SetStateAction } from 'react';

export const handle =
  (fn: Dispatch<SetStateAction<string>>): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
  e => {
    fn(e.currentTarget.value);
  };
