import axios from 'axios';

export type Campaign = {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
  userId: string;
};

export const getCampaigns = () => {
  return axios.get<Campaign[]>('/api/campaigns');
};
