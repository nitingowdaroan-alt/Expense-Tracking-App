import { useState, useMemo } from 'react';
import { Settings, Save } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../utils/constants';
import { filterExpensesByMonth, calculateTotalByCategory, formatCurrency } from '../../utils/helpers';
import BudgetProgress from './BudgetProgress';
import Modal from '../common/Modal';
import './BudgetManager.css';

const BudgetManager = () => {
  const { expenses, budgets, setBudgets, selectedMonth } = useExpenses();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editedBudgets, setEditedBudgets] = useState(budgets);

  const categorySpending = useMemo(() => {
    const monthExpenses = filterExpensesByMonth(expenses, selectedMonth);
    return calculateTotalByCategory(monthExpenses);
  }, [expenses, selectedMonth]);

  const totalSpent = useMemo(() => {
    return Object.values(categorySpending).reduce((sum, val) => sum + val, 0);
  }, [categorySpending]);

  const handleBudgetChange = (key, value) => {
    const numValue = parseFloat(value) || 0;
    setEditedBudgets(prev => ({ ...prev, [key]: numValue }));
  };

  const handleSaveBudgets = () => {
    setBudgets(editedBudgets);
    setIsSettingsOpen(false);
  };

  const openSettings = () => {
    setEditedBudgets(budgets);
    setIsSettingsOpen(true);
  };

  return (
    <div className="budget-manager">
      <div className="budget-manager-header">
        <div>
          <h1>Budget Management</h1>
          <p className="budget-subtitle">Set and track your spending limits</p>
        </div>
        <button className="btn-primary" onClick={openSettings}>
          <Settings size={18} />
          Edit Budgets
        </button>
      </div>

      {/* Overall Budget */}
      <div className="overall-budget card">
        <h3>Monthly Budget Overview</h3>
        <div className="overall-budget-content">
          <div className="overall-budget-stats">
            <div className="budget-stat">
              <span className="budget-stat-label">Budget</span>
              <span className="budget-stat-value">{formatCurrency(budgets.monthly)}</span>
            </div>
            <div className="budget-stat">
              <span className="budget-stat-label">Spent</span>
              <span className="budget-stat-value">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="budget-stat">
              <span className="budget-stat-label">Remaining</span>
              <span className={`budget-stat-value ${totalSpent > budgets.monthly ? 'text-danger' : 'text-success'}`}>
                {formatCurrency(Math.max(0, budgets.monthly - totalSpent))}
              </span>
            </div>
          </div>
          <div className="overall-progress-bar">
            <div
              className={`overall-progress-fill ${totalSpent > budgets.monthly ? 'exceeded' : totalSpent > budgets.monthly * 0.8 ? 'warning' : ''}`}
              style={{ width: `${Math.min((totalSpent / budgets.monthly) * 100, 100)}%` }}
            />
          </div>
          <div className="overall-progress-label">
            {((totalSpent / budgets.monthly) * 100).toFixed(1)}% of monthly budget used
          </div>
        </div>
      </div>

      {/* Category Budgets */}
      <h3 className="section-title">Category Budgets</h3>
      <div className="category-budgets-grid">
        {CATEGORIES.map(category => (
          <BudgetProgress
            key={category.id}
            category={category.name}
            spent={categorySpending[category.id] || 0}
            budget={budgets[category.id] || 0}
            color={category.color}
          />
        ))}
      </div>

      {/* Budget Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Edit Budgets"
        size="medium"
      >
        <div className="budget-settings">
          <div className="budget-setting-group">
            <label>Monthly Budget</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={editedBudgets.monthly}
                onChange={(e) => handleBudgetChange('monthly', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </div>

          <div className="budget-settings-divider">
            <span>Category Limits</span>
          </div>

          <div className="category-budget-settings">
            {CATEGORIES.map(category => (
              <div key={category.id} className="budget-setting-group">
                <label>
                  <span
                    className="category-dot"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </label>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    value={editedBudgets[category.id] || 0}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="budget-settings-actions">
            <button
              className="btn-secondary"
              onClick={() => setIsSettingsOpen(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveBudgets}>
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetManager;
