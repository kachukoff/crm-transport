import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const ToastContext = createContext(null);
let nextId = 0;

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7.5" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
};

function ToastViewport({ toasts, onClose }) {
  const { t } = useTranslation();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map(({ id, type, message }) => (
        <div
          key={id}
          className={`toast toast--${type}`}
          role={type === 'error' ? 'alert' : 'status'}
        >
          <span className="toast__icon" aria-hidden="true">{ICONS[type]}</span>
          <span className="toast__message">{message}</span>
          <button
            type="button"
            className="toast__close"
            onClick={() => onClose(id)}
            aria-label={t('common.close')}
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const close = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', duration = 4200) => {
    const id = ++nextId;
    setToasts((items) => [...items, { id, message, type }]);

    if (duration > 0) {
      window.setTimeout(() => close(id), duration);
    }

    return id;
  }, [close]);

  const toast = useMemo(() => ({
    show,
    success: (message, duration) => show(message, 'success', duration),
    error: (message, duration) => show(message, 'error', duration ?? 6000),
    info: (message, duration) => show(message, 'info', duration),
  }), [show]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onClose={close} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}