import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorBanner = ({ error, onRetry }) => {
  if (!error) return null;

  const errorMessage =
    typeof error === 'string'
      ? error
      : error.message || 'An error occurred while communicating with the server.';

  return (
    <div
      style={{
        background: 'var(--danger-light)',
        border: '1px solid #fca5a5',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        color: '#991b1b',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} color="var(--danger)" />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{errorMessage}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#ffffff',
            border: '1px solid #fca5a5',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: '#991b1b',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};
