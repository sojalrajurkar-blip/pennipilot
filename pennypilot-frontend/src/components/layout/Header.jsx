import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/expenses':
        return 'All Expenses';
      case '/expenses/new':
        return 'Add New Expense';
      default:
        if (location.pathname.includes('/edit')) return 'Edit Expense';
        return 'PennyPilot';
    }
  };

  return (
    <header className="header">
      <h1 className="header-title">{getPageTitle()}</h1>
      <div className="header-actions">
        <span className="date-badge">{formatDate(new Date())}</span>
        {location.pathname !== '/expenses/new' && (
          <Link to="/expenses/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} />
            <span>Add Expense</span>
          </Link>
        )}
      </div>
    </header>
  );
};
