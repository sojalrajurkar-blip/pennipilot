import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpense } from '../hooks/useExpense';
import { useUpdateExpense } from '../hooks/useUpdateExpense';
import { ExpenseForm } from '../components/expense/ExpenseForm';
import { Loader } from '../components/common/Loader';
import { ErrorBanner } from '../components/common/ErrorBanner';

export const EditExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { expense, loading: fetchLoading, error: fetchError } = useExpense(id);
  const { updateExpense, loading: updateLoading, error: updateError } = useUpdateExpense();

  const handleSubmit = async (data) => {
    try {
      await updateExpense(id, data);
      navigate('/expenses');
    } catch (err) {
      console.error('Failed to update expense', err);
    }
  };

  if (fetchLoading) return <Loader message="Loading expense details..." />;

  return (
    <div className="page-container">
      <ErrorBanner error={fetchError || (updateError?.message ? updateError : null)} />
      {expense && (
        <ExpenseForm
          initialValues={expense}
          onSubmit={handleSubmit}
          loading={updateLoading}
          apiError={updateError}
          isEdit
          onCancel={() => navigate('/expenses')}
        />
      )}
    </div>
  );
};
