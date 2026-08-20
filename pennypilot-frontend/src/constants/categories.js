export const CATEGORIES = [
  { id: 'FOOD', label: 'Food & Dining', color: '#f59e0b', bg: '#fef3c7', icon: 'Utensils' },
  { id: 'TRANSPORT', label: 'Transport', color: '#3b82f6', bg: '#dbeafe', icon: 'Car' },
  { id: 'SHOPPING', label: 'Shopping', color: '#ec4899', bg: '#fce7f3', icon: 'ShoppingBag' },
  { id: 'BILLS', label: 'Bills & Utilities', color: '#ef4444', bg: '#fee2e2', icon: 'Receipt' },
  { id: 'HEALTH', label: 'Health & Medical', color: '#10b981', bg: '#d1fae5', icon: 'HeartPulse' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', color: '#8b5cf6', bg: '#ede9fe', icon: 'Film' },
  { id: 'OTHER', label: 'Other', color: '#6b7280', bg: '#f3f4f6', icon: 'MoreHorizontal' },
];

export const getCategoryMeta = (categoryId) => {
  return (
    CATEGORIES.find((c) => c.id === categoryId) || {
      id: categoryId,
      label: categoryId,
      color: '#6b7280',
      bg: '#f3f4f6',
      icon: 'Tag',
    }
  );
};
