import React from 'react';

export const SummaryCard = ({ label, value, icon: Icon, color = '#4f46e5', bg = '#eef2ff' }) => {
  return (
    <div className="card summary-card">
      <div className="summary-icon-box" style={{ backgroundColor: bg, color: color }}>
        {Icon && <Icon size={28} />}
      </div>
      <div className="summary-content">
        <span className="summary-label">{label}</span>
        <span className="summary-value">{value}</span>
      </div>
    </div>
  );
};
