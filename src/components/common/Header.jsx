import { Sun, Moon, Plus, Menu, X } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import './Header.css';

const Header = ({ onAddExpense, isSidebarOpen, toggleSidebar }) => {
  const { theme, toggleTheme } = useExpenses();

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn-ghost sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="logo">
          <span className="logo-icon">$</span>
          <span className="logo-text">ExpenseTracker</span>
        </div>
      </div>

      <div className="header-right">
        <button
          className="btn-ghost theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="btn-primary add-expense-btn" onClick={onAddExpense}>
          <Plus size={18} />
          <span className="add-expense-text">Add Expense</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
