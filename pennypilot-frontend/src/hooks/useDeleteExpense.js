import { useState } from 'react';
import { expenseApi } from '../api/expenseApi';

export const useDeleteExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteExpense = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await expenseApi.deleteExpense(id);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteExpense, loading, error };
};
