import { Sun, Moon, Plus, Menu, Search, Bell, User } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import './Header.css';

const Header = ({ onAddExpense, isSidebarOpen, toggleSidebar, pageTitle }) => {
  const { theme, toggleTheme } = useExpenses();

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn-ghost sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-title-section">
          <p className="header-breadcrumb">Pages / {pageTitle || 'Dashboard'}</p>
          <h1 className="header-title">{pageTitle || 'Dashboard'}</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button
            className="header-icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button className="header-icon-btn notification-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          <button className="btn-primary add-expense-btn" onClick={onAddExpense}>
            <Plus size={18} />
            <span className="add-expense-text">Add Expense</span>
          </button>

          <div className="header-profile">
            <div className="profile-avatar">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
