import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { queryClient } from './queryClient';

export interface Room {
  authorId: string;
  description: string;
  id: string;
  name: string;
}

export interface RoomAvailable {
  available: boolean;
  name: string;
}

export const getRooms = () => {
  return axios.get<Room[]>('/api/rooms').then(({ data }) => data);
};

export const getRoom = (roomId: string) => {
  return axios.get<Room>(`/api/rooms/${roomId}`).then(({ data }) => data);
};

export const checkRoomNameAvailability = (roomName: string) => {
  return axios.get<RoomAvailable>(`/api/rooms/available/${roomName}`).then(({ data }) => data);
};

export const createRoom = ({ name }: { name: string }) => {
  return axios.post<Room>('/api/rooms', { name }).then(({ data }) => data);
};

export const useRooms = () =>
  useQuery({
    queryFn: getRooms,
    queryKey: ['rooms'],
  });

export const useCreateRoom = () =>
  useMutation({
    mutationFn: createRoom,
    onSuccess: room => {
      queryClient.invalidateQueries<Room[]>({ exact: true, queryKey: ['rooms'] });
      queryClient.setQueryData(['rooms', room.id], () => room);
    },
  });

export const getRoomByIdOptions = (roomId: string) =>
  queryOptions({
    queryFn: () => getRoom(roomId),
    queryKey: ['rooms', roomId],
  });
