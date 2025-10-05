/* eslint-disable @typescript-eslint/no-use-before-define */
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/radix/')({
  component: RouteComponent,
});

const RouteComponent = () => {
  return <div>Hello radix!</div>;
};
