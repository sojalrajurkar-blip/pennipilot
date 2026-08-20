import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, Utensils, Car, ShoppingBag, Receipt, HeartPulse, Film, MoreHorizontal } from 'lucide-react';
import { getCategoryMeta } from '../../constants/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const iconMap = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  HeartPulse,
  Film,
  MoreHorizontal,
  Tag,
};

export const ExpenseListItem = ({ expense, onDeleteClick }) => {
  const categoryMeta = getCategoryMeta(expense.category);
  const CategoryIcon = iconMap[categoryMeta.icon] || Tag;

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{expense.title}</span>
          {expense.description && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {expense.description}
            </span>
          )}
        </div>
      </td>

      <td>
        <span
          className="badge"
          style={{ backgroundColor: categoryMeta.bg, color: categoryMeta.color }}
        >
          <CategoryIcon size={14} />
          {categoryMeta.label}
        </span>
      </td>

      <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        {formatDate(expense.expenseDate)}
      </td>

      <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>
        {formatCurrency(expense.amount)}
      </td>

      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Link to={`/expenses/${expense.id}/edit`} className="btn-icon" title="Edit expense">
            <Edit2 size={16} />
          </Link>
          <button
            onClick={() => onDeleteClick(expense)}
            className="btn-icon"
            title="Delete expense"
            style={{ color: 'var(--danger)' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};
