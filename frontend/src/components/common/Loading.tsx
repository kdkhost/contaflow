interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeMap = { sm: 24, md: 40, lg: 56 };

export default function Loading({ size = 'md', fullScreen }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"
            style={{ width: sizeMap[size], height: sizeMap[size] }}
          />
          <p className="text-sm text-slate-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      />
      <p className="text-sm text-slate-400 font-medium">Carregando...</p>
    </div>
  );
}
