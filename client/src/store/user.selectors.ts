import { useStore } from './store';

/**
 * Warning: this hook assumes you are using it in in a component that is only rendered when the current user is authenticated
 * It will throw otherwise
 */
export const useActiveUser = () => {
  const { user, setUser } = useStore();

  if (user == null) {
    throw new Error('Cannot use the `useActiveUser` hook in a component where the user is not authenticated');
  }

  return { setUser, user };
};
