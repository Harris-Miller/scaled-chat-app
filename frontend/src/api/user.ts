import type { AxiosError } from 'axios';
import axios from 'axios';
import { fromPromise } from 'neverthrow';

export type SuccessMessage = {
  message: string;
  success: true;
};

export type Profile = {
  email: string;
  success: true;
};

export type ApiError = {
  message: string;
  success: false;
};

export const getProfile = () => {
  return fromPromise(axios.get<Profile>('/api/user/profile'), err => err as AxiosError<ApiError>);
};

export const signIn = (email: string, password: string) => {
  return fromPromise(
    axios.post<SuccessMessage>('/api/user/sign-in', {
      email,
      password,
    }),
    err => err as AxiosError<ApiError>,
  );
};

export const signUp = (email: string, password: string) => {
  return fromPromise(
    axios.post<SuccessMessage>('/api/user/sign-up', {
      email,
      password,
    }),
    err => err as AxiosError<ApiError>,
  );
};

export const signOut = () => {
  return fromPromise(axios.get<Profile>('/api/user/sign-out'), err => err as AxiosError<ApiError>);
};
