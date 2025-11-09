import { PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Dialog, IconButton, Text, TextField } from '@radix-ui/themes';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Result } from 'try';

import { checkRoomNameAvailability, useCreateRoom } from '../../api/rooms';
import { handle, wait } from '../../utils';

export const CreateChannelDialog: FC = () => {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const navigate = useNavigate();
  const createRoom = useCreateRoom();

  useEffect(() => {
    let debounced = false;
    if (roomName.length < 4) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    wait(200)
      .then(async () => {
        if (debounced) return;

        const availResult = await Result.try(checkRoomNameAvailability(roomName));

        // false positive
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (debounced) return;

        if (!availResult.ok) {
          setErrorMessage((availResult.error as AxiosError).message);
          return;
        }

        if (!availResult.value.available) {
          setErrorMessage('RoomName Unavailable');
          return;
        }

        setErrorMessage(null);
      })
      .catch((err: unknown) => {
        setErrorMessage(err as string);
      })
      .finally(() => {
        if (debounced) return;
        setIsChecking(false);
      });

    return () => {
      debounced = true;
    };
  }, [roomName]);

  const submit = () => {
    if (isChecking) return;

    createRoom
      .mutateAsync({ name: roomName })
      .then(room => {
        setOpen(false);
        navigate({ params: { roomId: room.id }, to: '/rooms/$roomId' });
      })
      .catch((e: unknown) => {
        const { message } = e as { message: string };
        setErrorMessage(message);
      });
  };

  return (
    <Dialog.Root open={open}>
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
        size="1"
      >
        <PlusIcon />
      </IconButton>
      <Dialog.Content>
        <Dialog.Title>Create a Channel</Dialog.Title>
        <TextField.Root onChange={handle(setRoomName)} value={roomName} />
        {errorMessage != null && roomName.length > 4 ? <Text color="red">{errorMessage}</Text> : null}
        <Box>
          <Button
            onClick={() => {
              setOpen(false);
              setErrorMessage(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isChecking} onClick={submit}>
            Create Channel
          </Button>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};
