import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  Settings,
  Download
} from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'expenses', icon: Receipt, label: 'Expenses' },
  { id: 'analytics', icon: PieChart, label: 'Analytics' },
  { id: 'budgets', icon: Wallet, label: 'Budgets' },
];

const Sidebar = ({ activeView, onViewChange, isOpen, onClose }) => {
  const handleItemClick = (viewId) => {
    onViewChange(viewId);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Menu</span>
            <ul className="nav-list">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="quick-stats">
            <div className="stat-label">This Month</div>
            <div className="stat-hint">View your spending trends in the Analytics section</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
