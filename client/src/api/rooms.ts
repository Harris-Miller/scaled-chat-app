import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { queryClient } from './queryClient';

export interface Room {
  authorId: string;
  description: string;
  id: string;
  name: string;
}

export interface Chat {
  authorId: string;
  createdAt: string;
  id: string;
  roomId: string;
  text: string;
  updatedAt: string;
}

export const getRooms = () => {
  return axios.get<Room[]>('/api/rooms/');
};

export const getRoom = (roomId: string) => {
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

export const useRoom = (roomId: string) =>
  useQuery({
    queryFn: () => getRoom(roomId).then(({ data }) => data),
    queryKey: ['room', roomId],
  });

export const getChats = (roomId: string) => {
  return axios.get<Chat[]>(`/api/rooms/${roomId}/chats`);
};

export const postChat = (roomId: string, text: string) => {
  return axios.post<Chat>(`/api/rooms/${roomId}/chats`, { text });
};
