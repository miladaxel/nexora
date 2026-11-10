import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
          // Variants
          variant === 'primary' &&
            'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow',
          variant === 'secondary' &&
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40',
          variant === 'outline' &&
            'border border-border bg-card hover:bg-accent text-foreground hover:text-accent-foreground',
          variant === 'ghost' &&
            'hover:bg-accent text-muted-foreground hover:text-foreground',
          variant === 'destructive' &&
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs gap-1.5',
          size === 'md' && 'h-10 px-4 text-sm gap-2',
          size === 'lg' && 'h-11 px-6 text-base gap-2.5',
          size === 'icon' && 'h-10 w-10 p-0',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
