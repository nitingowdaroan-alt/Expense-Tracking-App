import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', subtitle }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp size={14} />;
    if (trend === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendClass = () => {
    if (!trend) return '';
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return 'trend-neutral';
  };

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-content">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <div className="stat-card-value">{value}</div>
          {trendValue && (
            <div className={`stat-card-trend ${getTrendClass()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
          {subtitle && (
            <span className="stat-card-subtitle">{subtitle}</span>
          )}
        </div>
        {Icon && (
          <div className="stat-card-icon-wrapper">
            <div className={`stat-card-icon stat-icon-${color}`}>
              <Icon size={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
