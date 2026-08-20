import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateExpense } from '../hooks/useCreateExpense';
import { ExpenseForm } from '../components/expense/ExpenseForm';
import { ErrorBanner } from '../components/common/ErrorBanner';

export const AddExpensePage = () => {
  const navigate = useNavigate();
  const { createExpense, loading, error } = useCreateExpense();

  const handleSubmit = async (data) => {
    try {
      await createExpense(data);
      navigate('/expenses');
    } catch (err) {
      console.error('Failed to create expense', err);
    }
  };

  return (
    <div className="page-container">
      <ErrorBanner error={error?.message ? error : null} />
      <ExpenseForm
        onSubmit={handleSubmit}
        loading={loading}
        apiError={error}
        onCancel={() => navigate('/expenses')}
      />
    </div>
  );
};
