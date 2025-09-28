import { Box, Button } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';

import { LoginDialog } from '../components/dialogs/LoginDialog';
import { useStore } from '../store';

const IndexComponent: FC = () => {
  const { user } = useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (user != null) {
    navigate({ to: '/rooms' });
    return null;
  }

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box flexDirection="column">
          <Box>Le Chat Rooms</Box>
          <Box>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <LoginDialog open={open} setOpen={setOpen} />
    </>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
