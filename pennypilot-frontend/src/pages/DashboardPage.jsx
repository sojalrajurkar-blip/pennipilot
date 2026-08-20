import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Hash, TrendingUp, Plus, ArrowRight, Sparkles, PieChart } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useExpenseSummary } from '../hooks/useExpenseSummary';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { ExpenseList } from '../components/expense/ExpenseList';
import { DeleteConfirmModal } from '../components/expense/DeleteConfirmModal';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORIES, getCategoryMeta } from '../constants/categories';

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

  // Calculate category-wise breakdown percentages for the progress bar
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const categoryBreakdown = Object.keys(categoryTotals).map((catId) => {
    const meta = getCategoryMeta(catId);
    const amount = categoryTotals[catId];
    const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    return { ...meta, amount, percentage };
  });

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="page-container">
      <ErrorBanner error={expensesError || summaryError} onRetry={() => { refetchExpenses(); refetchSummary(); }} />

      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Sparkles size={20} color="#a855f7" />
            <span style={{ color: '#c7d2fe', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Financial Command Center
            </span>
          </div>
          <h2>Welcome back to PennyPilot 👋</h2>
          <p>Here is your real-time expense overview and spending analysis.</p>
        </div>

        <Link to="/expenses/new" className="btn btn-primary">
          <Plus size={20} />
          <span>Quick Add Expense</span>
        </Link>
      </div>

      {/* Glowing Stat Cards */}
      <div className="stats-grid">
        <SummaryCard
          label="Total Amount Spent"
          value={formatCurrency(totalAmount)}
          icon={IndianRupee}
          color="#6366f1"
          bg="rgba(99, 102, 241, 0.15)"
        />
        <SummaryCard
          label="Total Expenses Count"
          value={totalCount}
          icon={Hash}
          color="#a855f7"
          bg="rgba(168, 85, 247, 0.15)"
        />
        <SummaryCard
          label="Average Expense"
          value={formatCurrency(averageAmount)}
          icon={TrendingUp}
          color="#10b981"
          bg="rgba(16, 185, 129, 0.15)"
        />
      </div>

      {/* Category Spending Breakdown Visual Meter */}
      {totalCount > 0 && (
        <div className="card category-progress-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={20} color="#818cf8" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Spending by Category</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {categoryBreakdown.length} active categories
            </span>
          </div>

          <div className="progress-bar-container">
            {categoryBreakdown.map((item) => (
              <div
                key={item.id}
                className="progress-segment"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.label}: ${formatCurrency(item.amount)} (${item.percentage.toFixed(1)}%)`}
              />
            ))}
          </div>

          <div className="category-legend">
            {categoryBreakdown.map((item) => (
              <div key={item.id} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }} />
                <span>
                  <strong style={{ color: 'var(--text-main)' }}>{item.label}</strong>: {formatCurrency(item.amount)} ({item.percentage.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Expenses List Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Recent Expenses</h2>
        <Link to="/expenses" className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          <span>View All Expenses</span>
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
