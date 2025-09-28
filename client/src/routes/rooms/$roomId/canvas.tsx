import { createFileRoute } from '@tanstack/react-router';

const CanvasComponent = () => {
  return <div>Hello /rooms/$roomId/canvas!</div>;
};

export const Route = createFileRoute('/rooms/$roomId/canvas')({
  component: CanvasComponent,
});
