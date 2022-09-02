import { FC, AnchorHTMLAttributes } from 'react';

const InlineLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <span
    {...props}
    className='cursor-pointer drop-shadow-sm text-slate-100 hover:text-slate-300'
  />
);

export default InlineLink;
