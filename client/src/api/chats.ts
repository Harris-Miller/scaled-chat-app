import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { queryClient } from './queryClient';

export interface Chat {
  authorId: string;
  createdAt: string;
  id: string;
  roomId: string;
  text: string;
  updatedAt: string;
}

export const getChats = (roomId: string) => {
  return axios.get<Chat[]>(`/api/rooms/${roomId}/chats`);
};

export const postChat = (roomId: string, text: string) => {
  return axios.post<Chat>(`/api/rooms/${roomId}/chats`, { text });
};
