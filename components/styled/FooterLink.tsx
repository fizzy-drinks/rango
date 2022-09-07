import { FC, PropsWithChildren } from 'react';
import InlineLink from './InlineLink';

const FooterLink: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <a href={href} target='_blank' rel='noreferrer'>
      <InlineLink>{children}</InlineLink>
    </a>
  );
};

export default FooterLink;
