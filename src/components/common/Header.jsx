import { Plus, Menu, Search, Bell, User } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import './Header.css';

// Custom Moon Icon (crescent moon for dark mode toggle)
const MoonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-6.002Z" />
  </svg>
);

// Custom Sun Icon (sun with rays for light mode toggle)
const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

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
            className="header-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
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
