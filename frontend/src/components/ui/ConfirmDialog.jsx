import React, { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  open,
  title = 'Megerősítés',
  message = 'Biztosan folytatod?',
  confirmLabel = 'Törlés',
  cancelLabel = 'Mégse',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open && !loading) onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={() => !loading && onCancel?.()}>
      <div
        className="confirm-dialog"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className={`confirm-icon-wrapper confirm-icon--${variant}`}>
          {variant === 'danger' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        <h3 id="confirm-title" className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-btn confirm-btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={`confirm-btn confirm-btn--${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="confirm-spinner" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
