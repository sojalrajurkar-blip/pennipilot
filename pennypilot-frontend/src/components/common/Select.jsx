import React from 'react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Select an option',
  required = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`form-select ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt.id} value={opt.value || opt.id}>
            {opt.label || opt.name || opt.value || opt.id}
          </option>
        ))}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};
