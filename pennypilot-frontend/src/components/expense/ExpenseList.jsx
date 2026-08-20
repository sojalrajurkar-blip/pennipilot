import React from 'react';
import { ExpenseListItem } from './ExpenseListItem';
import { Loader } from '../common/Loader';
import { Receipt } from 'lucide-react';

export const ExpenseList = ({ expenses = [], loading, onDeleteClick }) => {
  if (loading) {
    return <Loader message="Fetching expenses..." />;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Receipt size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No expenses found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '360px' }}>
          No expenses match your current filters. Add your first expense or clear active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title / Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                expense={expense}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
