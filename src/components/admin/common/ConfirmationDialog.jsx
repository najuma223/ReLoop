import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'primary', // 'primary' | 'danger'
  requireReason = false,
  reasonPlaceholder = 'Please specify reason...',
  onConfirm,
  onClose,
  loading = false,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('A justification or reason is mandatory for this operation.');
      return;
    }
    setError('');
    onConfirm(reason);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {confirmVariant === 'danger' && (
              <div style={{ color: '#ef4444', display: 'flex' }}>
                <AlertTriangle size={20} />
              </div>
            )}
            <h3 className="admin-modal-title">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="admin-icon-btn"
            style={{ width: '30px', height: '30px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="admin-modal-body">
          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
            {message}
          </p>

          {requireReason && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                Reason / Justification <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              {error && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                  {error}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`admin-btn ${confirmVariant === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
