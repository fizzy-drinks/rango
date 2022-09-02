import { FC, ButtonHTMLAttributes } from 'react';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className='px-2 mr-2 text-sm inline-block h-8 rounded border bg-slate-600 hover:bg-slate-800 transition-all disabled:hover:bg-slate-600'
  />
);

export default Button;
