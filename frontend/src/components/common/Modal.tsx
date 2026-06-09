import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = 'unset'; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizeMap[size]} max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-slide-in`}
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-10" />

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 text-slate-300 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: (e?: React.FormEvent) => void;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ModalFooter({ onCancel, onConfirm, confirmLabel = 'Salvar', isLoading }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0 -mx-6 -mb-4 mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isLoading}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Salvando...
          </span>
        ) : (
          confirmLabel
        )}
      </button>
    </div>
  );
}
