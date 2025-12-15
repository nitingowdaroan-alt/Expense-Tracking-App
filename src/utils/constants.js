export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: '#f59e0b' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '#3b82f6' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#8b5cf6' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', color: '#ef4444' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#10b981' },
  { id: 'health', name: 'Health', icon: 'Heart', color: '#ec4899' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#6366f1' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: '#64748b' },
];

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#3b82f6', '#64748b'
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const STORAGE_KEYS = {
  EXPENSES: 'expense-tracker-expenses',
  BUDGETS: 'expense-tracker-budgets',
  THEME: 'expense-tracker-theme',
};

export const DEFAULT_BUDGETS = {
  monthly: 3000,
  food: 500,
  transport: 300,
  entertainment: 200,
  bills: 800,
  shopping: 400,
  health: 200,
  education: 300,
  other: 300,
};
