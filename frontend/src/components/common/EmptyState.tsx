import { ComponentType, ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  message?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, message, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <Icon className="w-8 h-8 text-indigo-400" />
        </div>
      )}
      <h5 className="text-lg font-semibold text-white mb-1">{title || message || 'Nenhum registro encontrado'}</h5>
      {description && <p className="text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
