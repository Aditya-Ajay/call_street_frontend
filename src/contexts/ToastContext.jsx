/**
 * Toast Context
 * Provides toast notification functionality throughout the app
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { TOAST_DURATION } from '../utils/constants';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type ('success', 'error', 'info', 'warning')
   * @param {number} duration - Duration in ms (default: 3000)
   */
  const showToast = useCallback((message, type = 'info', duration = TOAST_DURATION) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  /**
   * Dismiss toast by ID
   * @param {number} id - Toast ID
   */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Show success toast
   */
  const success = useCallback((message) => showToast(message, 'success'), [showToast]);

  /**
   * Show error toast
   */
  const error = useCallback((message) => showToast(message, 'error'), [showToast]);

  /**
   * Show info toast
   */
  const info = useCallback((message) => showToast(message, 'info'), [showToast]);

  /**
   * Show warning toast
   */
  const warning = useCallback((message) => showToast(message, 'warning'), [showToast]);

  const value = {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    info,
    warning,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export default ToastContext;
