export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: '#ffb547' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '#4299e1' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#7551ff' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', color: '#ee5d50' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#01b574' },
  { id: 'health', name: 'Health', icon: 'Heart', color: '#ec4899' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#868cff' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: '#a3aed0' },
];

export const CHART_COLORS = [
  '#7551ff', '#01b574', '#ffb547', '#ee5d50',
  '#4299e1', '#ec4899', '#868cff', '#a3aed0'
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
  monthly: 50000,
  food: 10000,
  transport: 5000,
  entertainment: 3000,
  bills: 15000,
  shopping: 8000,
  health: 3000,
  education: 5000,
  other: 5000,
};
