import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const viewTitles = {
  dashboard: 'Dashboard',
  expenses: 'Expenses',
  analytics: 'Analytics',
  budgets: 'Budgets',
};

const Layout = ({ children, activeView, onViewChange, onAddExpense }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">
      <Sidebar
        activeView={activeView}
        onViewChange={onViewChange}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="layout-main">
        <Header
          onAddExpense={onAddExpense}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle={viewTitles[activeView]}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
