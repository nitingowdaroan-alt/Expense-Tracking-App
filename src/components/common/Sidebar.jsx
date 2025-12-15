import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  TrendingUp,
  HelpCircle,
  LogOut
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
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <TrendingUp size={24} />
          </div>
          <span className="brand-name">ExpenseTracker</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="nav-icon">
                    <item.icon size={20} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                  {activeView === item.id && <div className="nav-indicator" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Card */}
        <div className="sidebar-card">
          <div className="sidebar-card-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="url(#paint0_linear)" fillOpacity="0.3"/>
              <circle cx="30" cy="30" r="20" fill="url(#paint1_linear)" fillOpacity="0.5"/>
              <path d="M30 18V42M30 18L22 26M30 18L38 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="30" y1="2" x2="30" y2="58" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#868CFF"/>
                  <stop offset="1" stopColor="#7551FF"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="30" y1="10" x2="30" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#868CFF"/>
                  <stop offset="1" stopColor="#7551FF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h4>Track Smarter</h4>
          <p>Manage your expenses and stay on budget!</p>
          <button className="sidebar-card-btn">
            Learn More
          </button>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="nav-item footer-item">
            <div className="nav-icon">
              <HelpCircle size={20} />
            </div>
            <span className="nav-label">Help & Support</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
