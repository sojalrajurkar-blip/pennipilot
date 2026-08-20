import React, { useState, useEffect } from 'react';
import { Tag, Utensils, Car, ShoppingBag, Receipt, HeartPulse, Film, MoreHorizontal } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { CATEGORIES } from '../../constants/categories';
import { getTodayInputFormat } from '../../utils/formatDate';

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

export const ExpenseForm = ({
  initialValues,
  onSubmit,
  loading = false,
  apiError = null,
  isEdit = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    expenseDate: getTodayInputFormat(),
    description: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || '',
        amount: initialValues.amount || '',
        category: initialValues.category || 'FOOD',
        expenseDate: initialValues.expenseDate || getTodayInputFormat(),
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (apiError && apiError.fieldErrors) {
      const errMap = {};
      apiError.fieldErrors.forEach((fe) => {
        errMap[fe.field] = fe.message;
      });
      setFieldErrors(errMap);
    } else {
      setFieldErrors({});
    }
  }, [apiError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCategorySelect = (catId) => {
    setFormData((prev) => ({ ...prev, category: catId }));
    if (fieldErrors.category) {
      setFieldErrors((prev) => ({ ...prev, category: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = 'title must not be blank';
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = 'amount must be greater than 0';
    if (!formData.category) errors.category = 'category must not be null';
    if (!formData.expenseDate) errors.expenseDate = 'expenseDate must not be null';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.75rem', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {isEdit ? 'Edit Expense Details' : 'Record New Expense'}
      </h2>

      <Input
        label="Expense Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Weekly Groceries at BigBasket"
        required
        error={fieldErrors.title}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <Input
          label="Amount (₹)"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
          error={fieldErrors.amount}
        />

        <Input
          label="Expense Date"
          name="expenseDate"
          type="date"
          value={formData.expenseDate}
          onChange={handleChange}
          required
          error={fieldErrors.expenseDate}
        />
      </div>

      {/* Interactive Category Pill Selector */}
      <div className="form-group">
        <label className="form-label">
          Category <span style={{ color: 'var(--accent-rose)' }}>*</span>
        </label>
        <div className="category-select-grid">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Tag;
            const isSelected = formData.category === cat.id;
            return (
              <div
                key={cat.id}
                className={`category-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
                style={isSelected ? { borderColor: cat.color, backgroundColor: `${cat.color}25` } : {}}
              >
                <Icon size={16} color={isSelected ? cat.color : 'inherit'} />
                <span>{cat.label}</span>
              </div>
            );
          })}
        </div>
        {fieldErrors.category && <span className="error-text">{fieldErrors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-textarea ${fieldErrors.description ? 'error' : ''}`}
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add optional notes, invoice reference, or details..."
          maxLength={500}
        />
        {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '2rem' }}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Save Changes' : 'Create Expense'}
        </Button>
      </div>
    </form>
  );
};
