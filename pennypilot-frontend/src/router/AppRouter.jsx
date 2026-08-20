import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { ExpenseListPage } from '../pages/ExpenseListPage';
import { AddExpensePage } from '../pages/AddExpensePage';
import { EditExpensePage } from '../pages/EditExpensePage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/expenses" element={<ExpenseListPage />} />
      <Route path="/expenses/new" element={<AddExpensePage />} />
      <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
