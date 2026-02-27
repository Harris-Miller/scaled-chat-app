import { Button, Link } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import { forwardRef } from 'react';

//
// Implementation taken from https://tanstack.com/router/latest/docs/guide/custom-link#mui-example
//

export const RouterLink = createLink(Link);

const MUIButtonLinkComponent = forwardRef<HTMLAnchorElement, ButtonProps<'a'>>((props, ref) => (
  <Button component="a" ref={ref} {...props} />
));
export const RouterButtonLink = createLink(MUIButtonLinkComponent);
