import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useExpenseSummary } from '../hooks/useExpenseSummary';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { ExpenseFilterBar } from '../components/expense/ExpenseFilterBar';
import { ExpenseList } from '../components/expense/ExpenseList';
import { DeleteConfirmModal } from '../components/expense/DeleteConfirmModal';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { formatCurrency } from '../utils/formatCurrency';

export const ExpenseListPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    fromDate: '',
    toDate: '',
  });

  const { expenses, loading: expensesLoading, error, refetch: refetchExpenses } = useExpenses(filters);
  const { summary, loading: summaryLoading, refetch: refetchSummary } = useExpenseSummary(filters);
  const { deleteExpense, loading: deleteLoading } = useDeleteExpense();

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ category: '', fromDate: '', toDate: '' });
  };

  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExpense) return;
    try {
      await deleteExpense(selectedExpense.id);
      setIsDeleteOpen(false);
      setSelectedExpense(null);
      refetchExpenses();
      refetchSummary();
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  };

  return (
    <div className="page-container">
      <ExpenseFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <ErrorBanner error={error} onRetry={() => { refetchExpenses(); refetchSummary(); }} />

      {!summaryLoading && summary && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.75rem 1.25rem',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <span>Showing {summary.totalCount || 0} expenses</span>
          <span>Filtered Total: {formatCurrency(summary.totalAmount || 0)}</span>
        </div>
      )}

      <ExpenseList
        expenses={expenses}
        loading={expensesLoading}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        expense={selectedExpense}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
};
