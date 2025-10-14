/**
 * Toast Component
 * Displays toast notifications
 */

import { useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const Toast = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const typeClasses = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-info text-white',
    warning: 'bg-warning text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`
        ${typeClasses[toast.type]}
        px-5 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        max-w-md
        pointer-events-auto
        animate-slideDown
      `}
    >
      <span className="text-xl font-bold">{icons[toast.type]}</span>
      <span className="font-medium">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="ml-auto opacity-80 hover:opacity-100 w-6 h-6 flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
