import { Box, Typography } from '@mui/material';
import type { FC } from 'react';

import { useRoom } from '../../api/rooms';
import { roomRoute } from '../../router';

export const Room: FC = () => {
  const { roomId } = roomRoute.useParams();

  const query = useRoom(Number(roomId));

  console.log(query);

  return (
    <Box alignContent="center" display="flex" justifyContent="center">
      <Box>
        <Typography>Room: {roomId}</Typography>
      </Box>
      <Box>
        <Typography>Name: {query.data?.data.name}</Typography>
      </Box>
    </Box>
  );
};
