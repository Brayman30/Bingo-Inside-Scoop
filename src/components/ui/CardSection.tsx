import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardSectionProps {
  title?: string;
  id?: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
  description?: string;
}

export function CardSection({ title, id, children, className, aside, description }: CardSectionProps) {
  return (
    <section id={id} className={clsx('space-y-6', className)}>
      {(title || aside) && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {title && (
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-grayson-navy tracking-wide">{title}</h3>
              {description && <p className="text-xs text-grayson-navy/60">{description}</p>}
            </div>
          )}
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}
