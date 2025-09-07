import type { FC } from 'react';

import { DeadCenter } from '../components/DeadCenter';
import { LoginDialog } from '../components/Login';

export const LoginPage: FC = () => {
  return (
    <DeadCenter>
      <LoginDialog
        disableAutoFocus
        disableEnforceFocus
        disablePortal
        hideBackdrop
        open
        slotProps={{ paper: { style: { pointerEvents: 'auto' } } }} // Ensures content within dialog is interactive
      />
    </DeadCenter>
  );
};
