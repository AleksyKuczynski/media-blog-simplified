// src/shared/ui/EmptyState.tsx

interface EmptyStateProps {
  message: string;
  className?: string;
}

/**
 * Reusable empty state component for lists/collections
 */
export default function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`} role="status">
      <p className="text-on-sf-var">
        {message}
      </p>
    </div>
  );
}