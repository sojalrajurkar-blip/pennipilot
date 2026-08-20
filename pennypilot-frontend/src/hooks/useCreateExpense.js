import { useState } from 'react';
import { expenseApi } from '../api/expenseApi';

export const useCreateExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createExpense = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseApi.createExpense(data);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createExpense, loading, error, setError };
};
