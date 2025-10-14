/**
 * Modal Component
 * Reusable modal wrapper with mobile-optimized slide-up animation
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal should close
 * @param {string} title - Modal title (optional)
 * @param {string} size - 'sm' | 'md' | 'lg' | 'full'
 * @param {boolean} showCloseButton - Show X button in header
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer content (optional)
 * @param {string} className - Additional CSS classes
 */

import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  children,
  footer,
  className = '',
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    full: 'max-w-full w-full h-full',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Modal Content - Slide up on mobile, fade in on desktop */}
        <div
          className={`
            relative bg-white w-full sm:rounded-2xl shadow-2xl
            transform transition-all duration-300
            animate-slide-up sm:animate-fade-in
            max-h-[90vh] sm:max-h-[85vh]
            flex flex-col
            ${sizeClasses[size]}
            ${size === 'full' ? 'rounded-none' : 'rounded-t-3xl sm:rounded-2xl'}
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg sm:text-xl font-bold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-auto"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
