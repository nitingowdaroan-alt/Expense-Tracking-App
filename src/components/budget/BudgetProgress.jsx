import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, getBudgetStatus } from '../../utils/helpers';
import './BudgetProgress.css';

const BudgetProgress = ({ category, spent, budget, color }) => {
  const { percentage, status } = getBudgetStatus(spent, budget);

  const getStatusIcon = () => {
    switch (status) {
      case 'exceeded':
        return <AlertTriangle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  return (
    <div className={`budget-progress budget-${status}`}>
      <div className="budget-progress-header">
        <div className="budget-category">
          <div
            className="budget-category-dot"
            style={{ backgroundColor: color }}
          />
          <span className="budget-category-name">{category}</span>
        </div>
        <div className={`budget-status-icon status-${status}`}>
          {getStatusIcon()}
        </div>
      </div>

      <div className="budget-progress-bar">
        <div
          className={`budget-progress-fill progress-${status}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="budget-progress-info">
        <span className="budget-spent">
          {formatCurrency(spent)} <span className="budget-label">spent</span>
        </span>
        <span className="budget-total">
          {formatCurrency(budget)} <span className="budget-label">budget</span>
        </span>
      </div>

      {status === 'exceeded' && (
        <div className="budget-alert">
          Over budget by {formatCurrency(spent - budget)}
        </div>
      )}
      {status === 'warning' && (
        <div className="budget-warning">
          {formatCurrency(budget - spent)} remaining
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
