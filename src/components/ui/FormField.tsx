import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, required, error, help, children, className }: FormFieldProps) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-wider text-grayson-navy/70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {help && !error && (
        <p className="text-[10px] text-grayson-navy/55">{help}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}
