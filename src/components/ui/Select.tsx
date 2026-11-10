import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, children, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && <label className="block text-xs font-medium text-muted-foreground mb-1.5 text-right">{label}</label>}
        <div className="relative flex items-center">
          <select
            className={cn(
              'flex h-10 w-full appearance-none rounded-xl border border-input bg-card px-3.5 py-2 pl-9 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-right cursor-pointer',
              error && 'border-rose-500 focus-visible:ring-rose-500',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-rose-500 mt-1.5 text-right font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
