import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors leading-none',
        // Variants
        variant === 'default' && 'bg-primary/10 text-primary border border-primary/20',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground border border-border/50',
        variant === 'success' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
        variant === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
        variant === 'destructive' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
        variant === 'info' && 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
        variant === 'outline' && 'text-foreground border border-border',
        // Sizes
        size === 'sm' && 'px-2 py-0.5 text-[11px] gap-1',
        size === 'md' && 'px-2.5 py-1 text-xs gap-1.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
