import axios from 'axios';

export type Character = {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
  userId: string;
};

export const getCharacters = () => {
  return axios.get<Character[]>('/api/characters');
};
