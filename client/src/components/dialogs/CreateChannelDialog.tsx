import { PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Dialog, IconButton, Text, TextField } from '@radix-ui/themes';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Result } from 'try';

import { checkRoomNameAvailability, useCreateRoom } from '../../api/rooms';
import { handle, wait } from '../../utils';

export const CreateChannelDialog: FC = () => {
  const debounceCounter = useRef(0);
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const navigate = useNavigate();
  const createRoom = useCreateRoom();

  useEffect(() => {
    if (roomName.length < 4) {
      setErrorMessage(null);
      return;
    }

    debounceCounter.current += 1;
    const { current } = debounceCounter;

    wait(200)
      .then(async () => {
        if (current !== debounceCounter.current) return;

        const availResult = await Result.try(checkRoomNameAvailability(roomName));

        if (current !== debounceCounter.current) return;

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
        if (current !== debounceCounter.current) return;
        setIsChecking(false);
      });
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
      >
        <PlusIcon />
      </IconButton>
      <Dialog.Content>
        <Dialog.Title>Create a Channel</Dialog.Title>
        <TextField.Root onChange={handle(setRoomName)} value={roomName} />
        {errorMessage != null ? <Text color="red">{errorMessage}</Text> : null}
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
