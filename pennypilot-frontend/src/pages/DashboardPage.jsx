import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Hash, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useExpenseSummary } from '../hooks/useExpenseSummary';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { ExpenseList } from '../components/expense/ExpenseList';
import { DeleteConfirmModal } from '../components/expense/DeleteConfirmModal';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { formatCurrency } from '../utils/formatCurrency';

export const DashboardPage = () => {
  const { expenses, loading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useExpenses();
  const { summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useExpenseSummary();
  const { deleteExpense, loading: deleteLoading } = useDeleteExpense();

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const totalAmount = summary.totalAmount || 0;
  const totalCount = summary.totalCount || 0;
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="page-container">
      <ErrorBanner error={expensesError || summaryError} onRetry={() => { refetchExpenses(); refetchSummary(); }} />

      <div className="stats-grid">
        <SummaryCard
          label="Total Amount Spent"
          value={formatCurrency(totalAmount)}
          icon={IndianRupee}
          color="#4f46e5"
          bg="#eef2ff"
        />
        <SummaryCard
          label="Total Expenses"
          value={totalCount}
          icon={Hash}
          color="#8b5cf6"
          bg="#ede9fe"
        />
        <SummaryCard
          label="Average Expense"
          value={formatCurrency(averageAmount)}
          icon={TrendingUp}
          color="#10b981"
          bg="#d1fae5"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Expenses</h2>
        <Link to="/expenses" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
          <span>View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <ExpenseList
        expenses={recentExpenses}
        loading={expensesLoading || summaryLoading}
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
