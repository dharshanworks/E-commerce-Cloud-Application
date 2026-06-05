import { useState, useCallback } from 'react';
import { ToastContext } from './ToastContextObject.js';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;
      const toast = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, duration = 3000) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message, duration = 5000) => addToast(message, 'error', duration),
    [addToast]
  );

  const warning = useCallback(
    (message, duration = 4000) => addToast(message, 'warning', duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration = 3000) => addToast(message, 'info', duration),
    [addToast]
  );

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    toasts,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
