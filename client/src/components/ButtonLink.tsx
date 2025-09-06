import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import type { LinkComponent } from '@tanstack/react-router';
import { forwardRef } from 'react';

const MUIButtonLinkComponent = forwardRef<HTMLAnchorElement, ButtonProps<'a'>>((props, ref) => (
  <Button component="a" ref={ref} {...props} />
));

const ButtonLinkComponent = createLink(MUIButtonLinkComponent);

export const ButtonLink: LinkComponent<typeof MUIButtonLinkComponent> = props => {
  return <ButtonLinkComponent preload="intent" {...props} />;
};
