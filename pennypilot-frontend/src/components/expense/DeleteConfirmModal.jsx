import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

export const DeleteConfirmModal = ({ isOpen, expense, onConfirm, onCancel, loading }) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Delete Expense?</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              This action cannot be undone.
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong>"{expense.title}"</strong> of amount{' '}
          <strong>₹{expense.amount}</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete Expense
          </Button>
        </div>
      </div>
    </div>
  );
};
