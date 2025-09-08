import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { queryClient } from './queryClient';

export interface Room {
  description: string;
  id: number;
  name: string;
}

export const getRoom = (roomId: number) => {
  return axios.get<Room>(`/api/rooms/${roomId}`);
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

export const useRoom = (roomId: number) =>
  useQuery({
    queryFn: () => getRoom(roomId).then(({ data }) => data),
    queryKey: ['room', roomId],
  });
