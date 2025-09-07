import type { StateCreator } from 'zustand';

export interface Room {
  description: string;
  id: number;
  name: string;
}

export interface RoomSlice {
  room: Room | null;
  setRoom: (room: Room) => void;
}

export const createRoomSlice: StateCreator<RoomSlice> = set => ({
  room: null,
  setRoom: room => {
    set({ room });
  },
});
