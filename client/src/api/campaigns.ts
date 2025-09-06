import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

import { queryClient } from './client';

export type Campaign = {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
  userId: string;
};

export const getCampaigns = () => {
  return axios.get<Campaign[]>('/api/campaigns').then(r => r.data);
};

export const useCampaigns = () => {
  const results = useQuery({
    queryFn: getCampaigns,
    queryKey: ['campaigns'],
  });

  useEffect(() => {
    if (results.isPending) return;

    if (results.isError) {
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    } else {
      // console.log(results.data);
      results.data.forEach(c => {
        queryClient.setQueryData(['campaign', c.id], c);
      });
    }
  }, [results.isPending]);

  return results;
};

export const getCampaign = (campaignId: string) => {
  return axios.get<Campaign>(`/api/campaigns/${campaignId}`).then(r => r.data);
};

export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryFn: () => getCampaign(campaignId),
    queryKey: ['campaign', campaignId],
  });
};
