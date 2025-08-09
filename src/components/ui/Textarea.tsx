import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full rounded-md border bg-white/70 backdrop-blur-sm px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-grayson-gold/60 focus:border-grayson-gold/70 placeholder:text-grayson-navy/40 resize-y',
        'border-border-subtle/60',
        error && 'border-red-400 focus:ring-red-400/40 focus:border-red-500',
        className
      )}
      {...props}
    />
  );
});
