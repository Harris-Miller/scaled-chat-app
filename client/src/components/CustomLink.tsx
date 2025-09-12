import { Link } from '@mui/material';
import type { LinkProps } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import type { LinkComponent } from '@tanstack/react-router';
import { forwardRef } from 'react';

const MUILinkComponent = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link ref={ref} {...props} />);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const CustomLink: LinkComponent<typeof MUILinkComponent> = props => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
