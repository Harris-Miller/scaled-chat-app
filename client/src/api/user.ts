import axios from 'axios';

import type { SuccessMessage } from './api.types';

export interface User {
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  profilePicId?: string;
  updatedAt: string;
}

export const getProfile = () => {
  return axios.get<User>('/api/user/profile');
};

export const signIn = (email: string, password: string) => {
  return axios.post<SuccessMessage>('/api/user/sign-in', {
    email,
    password,
  });
};

export const signUp = (email: string, password: string) => {
  return axios.post<SuccessMessage>('/api/user/sign-up', {
    email,
    password,
  });
};

export const signOut = () => {
  return axios.get<User>('/api/user/sign-out');
};
