import { useMemo } from 'react';
import { Wallet, TrendingUp, Receipt, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import {
  filterExpensesByMonth,
  formatCurrency,
  calculateMonthlyTotals,
  getBudgetStatus
} from '../../utils/helpers';
import StatCard from './StatCard';
import SpendingChart from './SpendingChart';
import TrendChart from './TrendChart';
import RecentExpenses from './RecentExpenses';
import './Dashboard.css';

const Dashboard = ({ onViewExpenses }) => {
  const { expenses, budgets, selectedMonth } = useExpenses();

  const stats = useMemo(() => {
    const monthExpenses = filterExpensesByMonth(expenses, selectedMonth);
    const monthlyTotals = calculateMonthlyTotals(expenses, 2);

    const currentMonthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const previousMonthTotal = monthlyTotals.length >= 2 ? monthlyTotals[0].total : 0;

    const percentChange = previousMonthTotal > 0
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
      : 0;

    const budgetStatus = getBudgetStatus(currentMonthTotal, budgets.monthly);
    const avgExpense = monthExpenses.length > 0
      ? currentMonthTotal / monthExpenses.length
      : 0;

    return {
      totalSpent: currentMonthTotal,
      transactionCount: monthExpenses.length,
      avgExpense,
      budgetStatus,
      percentChange,
      budgetRemaining: Math.max(0, budgets.monthly - currentMonthTotal),
    };
  }, [expenses, budgets, selectedMonth]);

  const getTrendDirection = (percentChange) => {
    if (percentChange > 5) return 'up';
    if (percentChange < -5) return 'down';
    return 'neutral';
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon={Wallet}
          color="primary"
          trend={getTrendDirection(stats.percentChange)}
          trendValue={`${stats.percentChange >= 0 ? '+' : ''}${stats.percentChange.toFixed(1)}% from last month`}
        />
        <StatCard
          title="Transactions"
          value={stats.transactionCount}
          icon={Receipt}
          color="success"
          subtitle="This month"
        />
        <StatCard
          title="Average Expense"
          value={formatCurrency(stats.avgExpense)}
          icon={TrendingUp}
          color="info"
          subtitle="Per transaction"
        />
        <StatCard
          title="Budget Remaining"
          value={formatCurrency(stats.budgetRemaining)}
          icon={PiggyBank}
          color={stats.budgetStatus.status === 'exceeded' ? 'danger' : stats.budgetStatus.status === 'warning' ? 'warning' : 'success'}
          subtitle={`${stats.budgetStatus.percentage.toFixed(0)}% used`}
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <TrendChart />
        </div>
        <div className="chart-card">
          <SpendingChart />
        </div>
      </div>

      <div className="bottom-section">
        <RecentExpenses onViewAll={onViewExpenses} />
      </div>
    </div>
  );
};

export default Dashboard;
