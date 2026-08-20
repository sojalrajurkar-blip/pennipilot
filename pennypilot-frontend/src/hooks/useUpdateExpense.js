import { useState } from 'react';
import { expenseApi } from '../api/expenseApi';

export const useUpdateExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateExpense = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseApi.updateExpense(id, data);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateExpense, loading, error, setError };
};
