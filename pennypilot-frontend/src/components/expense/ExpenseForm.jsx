import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CATEGORIES } from '../../constants/categories';
import { getTodayInputFormat } from '../../utils/formatDate';

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

  // Extract field-level errors if API returns validation errors
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client validation
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

  const categoryOptions = CATEGORIES.map((c) => ({ value: c.id, label: c.label }));

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        {isEdit ? 'Edit Expense Details' : 'Record New Expense'}
      </h2>

      <Input
        label="Expense Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Weekly Groceries"
        required
        error={fieldErrors.title}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
          error={fieldErrors.category}
        />
      </div>

      <Input
        label="Expense Date"
        name="expenseDate"
        type="date"
        value={formData.expenseDate}
        onChange={handleChange}
        required
        error={fieldErrors.expenseDate}
      />

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
          placeholder="Add optional details or notes..."
          maxLength={500}
        />
        {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
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
