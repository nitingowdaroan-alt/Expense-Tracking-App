import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatDate, sortExpenses } from '../../utils/helpers';
import './RecentExpenses.css';

const RecentExpenses = ({ onViewAll }) => {
  const { expenses } = useExpenses();

  const recentExpenses = useMemo(() => {
    const sorted = sortExpenses(expenses, 'date', 'desc');
    return sorted.slice(0, 5);
  }, [expenses]);

  if (recentExpenses.length === 0) {
    return (
      <div className="recent-expenses-container">
        <div className="recent-expenses-header">
          <h3 className="chart-title">Recent Expenses</h3>
        </div>
        <div className="recent-expenses-empty">
          <p>No expenses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-expenses-container">
      <div className="recent-expenses-header">
        <h3 className="chart-title">Recent Expenses</h3>
        <button className="btn-ghost view-all-btn" onClick={onViewAll}>
          View all <ArrowRight size={14} />
        </button>
      </div>
      <div className="recent-expenses-list">
        {recentExpenses.map(expense => {
          const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[CATEGORIES.length - 1];
          return (
            <div key={expense.id} className="recent-expense-item">
              <div
                className="recent-expense-icon"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.name.charAt(0)}
              </div>
              <div className="recent-expense-info">
                <span className="recent-expense-desc">{expense.description}</span>
                <span className="recent-expense-date">{formatDate(expense.date, 'MMM dd')}</span>
              </div>
              <span className="recent-expense-amount">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentExpenses;
