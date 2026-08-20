import React from 'react';
import { Filter, X } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';

export const ExpenseFilterBar = ({ filters, onFilterChange, onReset }) => {
  const categoryOptions = CATEGORIES.map((c) => ({ value: c.id, label: c.label }));

  const hasActiveFilters = filters.category || filters.date || filters.fromDate || filters.toDate;

  return (
    <div className="filter-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
        <Filter size={18} />
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Filter Expenses:</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px', padding: '0.5rem 0.85rem' }}
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>From:</span>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
            value={filters.fromDate || ''}
            onChange={(e) => onFilterChange('fromDate', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>To:</span>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
            value={filters.toDate || ''}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
