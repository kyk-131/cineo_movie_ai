import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-transparent',
          'bg-gradient-to-r from-cineo-blue to-cineo-purple bg-clip-border',
          sizeClasses[size]
        )}
        style={{
          background: 'conic-gradient(from 0deg, #00F0FF, #9B5DE5, #00F0FF)',
          borderRadius: '50%',
          padding: '2px',
        }}
      >
        <div className="w-full h-full rounded-full bg-background" />
      </div>
    </div>
  );
}