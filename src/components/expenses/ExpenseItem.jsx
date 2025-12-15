import { Edit2, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './ExpenseItem.css';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <div className="expense-item animate-fade-in">
      <div className="expense-icon" style={{ backgroundColor: `${category.color}20` }}>
        <span style={{ color: category.color }}>{category.name.charAt(0)}</span>
      </div>

      <div className="expense-details">
        <div className="expense-description">{expense.description}</div>
        <div className="expense-meta">
          <span className={`badge badge-${expense.category}`}>{category.name}</span>
          <span className="expense-date">{formatDate(expense.date)}</span>
        </div>
      </div>

      <div className="expense-amount">
        {formatCurrency(expense.amount)}
      </div>

      <div className="expense-actions">
        <button
          className="btn-ghost btn-icon"
          onClick={() => onEdit(expense)}
          aria-label="Edit expense"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="btn-ghost btn-icon delete-btn"
          onClick={() => onDelete(expense.id)}
          aria-label="Delete expense"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
