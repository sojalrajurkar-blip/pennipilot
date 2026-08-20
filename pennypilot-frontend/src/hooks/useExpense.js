import { useState, useEffect } from 'react';
import { expenseApi } from '../api/expenseApi';

export const useExpense = (id) => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    expenseApi
      .getExpenseById(id)
      .then((data) => {
        if (isMounted) setExpense(data);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { expense, loading, error };
};
