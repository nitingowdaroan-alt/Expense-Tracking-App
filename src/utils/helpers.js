import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const getMonthYear = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM yyyy');
};

export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthRange = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfMonth(dateObj),
    end: endOfMonth(dateObj),
  };
};

export const filterExpensesByMonth = (expenses, monthString) => {
  const [year, month] = monthString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, 1);
  const { start, end } = getMonthRange(targetDate);

  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start, end });
  });
};

export const filterExpensesByDateRange = (expenses, startDate, endDate) => {
  if (!startDate || !endDate) return expenses;

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start, end });
  });
};

export const filterExpensesByCategory = (expenses, category) => {
  if (!category || category === 'all') return expenses;
  return expenses.filter(expense => expense.category === category);
};

export const filterExpensesByAmount = (expenses, minAmount, maxAmount) => {
  return expenses.filter(expense => {
    const amount = expense.amount;
    if (minAmount && amount < minAmount) return false;
    if (maxAmount && amount > maxAmount) return false;
    return true;
  });
};

export const searchExpenses = (expenses, searchTerm) => {
  if (!searchTerm) return expenses;
  const term = searchTerm.toLowerCase();
  return expenses.filter(expense =>
    expense.description.toLowerCase().includes(term) ||
    expense.category.toLowerCase().includes(term)
  );
};

export const calculateTotalByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});
};

export const calculateMonthlyTotals = (expenses, months = 6) => {
  const monthlyTotals = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const targetDate = subMonths(now, i);
    const monthString = format(targetDate, 'yyyy-MM');
    const monthExpenses = filterExpensesByMonth(expenses, monthString);
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    monthlyTotals.push({
      month: format(targetDate, 'MMM'),
      fullMonth: format(targetDate, 'MMMM yyyy'),
      total: total,
    });
  }

  return monthlyTotals;
};

export const getBudgetStatus = (spent, budget) => {
  if (!budget || budget === 0) return { percentage: 0, status: 'normal' };

  const percentage = (spent / budget) * 100;
  let status = 'normal';

  if (percentage >= 100) {
    status = 'exceeded';
  } else if (percentage >= 80) {
    status = 'warning';
  }

  return { percentage: Math.min(percentage, 100), status };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const exportToCSV = (expenses) => {
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const rows = expenses.map(expense => [
    expense.date,
    `"${expense.description}"`,
    expense.category,
    expense.amount.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const sortExpenses = (expenses, sortBy = 'date', order = 'desc') => {
  return [...expenses].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = new Date(a.date) - new Date(b.date);
    }

    return order === 'desc' ? -comparison : comparison;
  });
};
