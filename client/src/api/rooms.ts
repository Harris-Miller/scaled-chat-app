import { queryOptions, useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { queryClient } from './queryClient';

export interface Room {
  authorId: string;
  description: string;
  id: string;
  name: string;
}

export const getRooms = () => {
  return axios.get<Room[]>('/api/rooms/').then(({ data }) => data);
};

export const getRoom = (roomId: string) => {
  return axios.get<Room>(`/api/rooms/${roomId}`).then(({ data }) => data);
};

export const createRoom = ({ name }: { name: string }) => {
  return axios.post<Room>('/api/rooms', { name });
};

export const useCreateRoom = () =>
  useMutation({
    mutationFn: createRoom,
    onSuccess: resp => {
      queryClient.setQueryData(['room', resp.data.id], () => resp.data);
    },
  });

export const getRoomByIdOptions = (roomId: string) =>
  queryOptions({
    queryFn: () => getRoom(roomId),
    queryKey: ['room', roomId],
  });
