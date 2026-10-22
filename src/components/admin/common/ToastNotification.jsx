import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        background: '#ffffff',
        borderLeft: isError ? '4px solid #ef4444' : '4px solid #10b981',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        maxWidth: '420px',
        animation: 'slideInRight 0.2s ease-out',
      }}
    >
      <div style={{ color: isError ? '#ef4444' : '#10b981', display: 'flex' }}>
        {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
          {isError ? 'Action Failed' : 'Success'}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
          {toast.message}
        </span>
      </div>
      <button
        onClick={onClose}
        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
