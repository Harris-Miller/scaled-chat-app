import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

import { LoginDialog } from '../components/Login';
import { useStore } from '../store';

import { LandingPage } from './-landingPage';

const IndexComponent: FC = () => {
  const { user } = useStore();

  return user == null ? <LoginDialog open /> : <LandingPage />;
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
