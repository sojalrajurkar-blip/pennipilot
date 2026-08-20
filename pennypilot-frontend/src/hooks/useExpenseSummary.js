import { useState, useEffect, useCallback } from 'react';
import { expenseApi } from '../api/expenseApi';

export const useExpenseSummary = (filters = {}) => {
  const [summary, setSummary] = useState({ totalAmount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseApi.getExpenseSummary(filters);
      setSummary(data || { totalAmount: 0, totalCount: 0 });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};
