import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES, CHART_COLORS } from '../utils/constants';
import {
  filterExpensesByMonth,
  calculateTotalByCategory,
  calculateMonthlyTotals,
  formatCurrency
} from '../utils/helpers';
import './Analytics.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="analytics-tooltip">
        <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { expenses, budgets, selectedMonth } = useExpenses();

  const categoryData = useMemo(() => {
    const monthExpenses = filterExpensesByMonth(expenses, selectedMonth);
    const totals = calculateTotalByCategory(monthExpenses);
    const totalAmount = Object.values(totals).reduce((sum, val) => sum + val, 0);

    return CATEGORIES
      .map((cat, index) => ({
        name: cat.name,
        value: totals[cat.id] || 0,
        budget: budgets[cat.id] || 0,
        percentage: totalAmount > 0 ? ((totals[cat.id] || 0) / totalAmount) * 100 : 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .filter(item => item.value > 0 || item.budget > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses, budgets, selectedMonth]);

  const monthlyData = useMemo(() => {
    return calculateMonthlyTotals(expenses, 12);
  }, [expenses]);

  const stats = useMemo(() => {
    const monthExpenses = filterExpensesByMonth(expenses, selectedMonth);
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgPerDay = total / 30;
    const highestExpense = monthExpenses.length > 0
      ? Math.max(...monthExpenses.map(e => e.amount))
      : 0;
    const lowestExpense = monthExpenses.length > 0
      ? Math.min(...monthExpenses.map(e => e.amount))
      : 0;

    return {
      total,
      avgPerDay,
      highestExpense,
      lowestExpense,
      transactionCount: monthExpenses.length,
    };
  }, [expenses, selectedMonth]);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p className="analytics-subtitle">Detailed insights into your spending patterns</p>
      </div>

      {/* Quick Stats */}
      <div className="analytics-stats-row">
        <div className="analytics-stat-card">
          <span className="stat-label">Total Spending</span>
          <span className="stat-value">{formatCurrency(stats.total)}</span>
        </div>
        <div className="analytics-stat-card">
          <span className="stat-label">Daily Average</span>
          <span className="stat-value">{formatCurrency(stats.avgPerDay)}</span>
        </div>
        <div className="analytics-stat-card">
          <span className="stat-label">Highest Expense</span>
          <span className="stat-value">{formatCurrency(stats.highestExpense)}</span>
        </div>
        <div className="analytics-stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value">{stats.transactionCount}</span>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Category Breakdown Pie Chart */}
        <div className="analytics-card">
          <h3>Spending Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                  labelLine={{ stroke: 'var(--text-muted)' }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="analytics-empty">No data available</div>
          )}
        </div>

        {/* Budget vs Actual Bar Chart */}
        <div className="analytics-card">
          <h3>Budget vs Actual</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                <XAxis type="number" tickFormatter={(value) => `₹${value}`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" fill="var(--bg-tertiary)" name="Budget" radius={[0, 4, 4, 0]} />
                <Bar dataKey="value" fill="var(--accent-primary)" name="Spent" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="analytics-empty">No data available</div>
          )}
        </div>
      </div>

      {/* Monthly Trend - Full Width */}
      <div className="analytics-card analytics-card-full">
        <h3>12-Month Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="analytics-tooltip">
                      <p className="tooltip-label">{payload[0].payload.fullMonth}</p>
                      <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Table */}
      <div className="analytics-card analytics-card-full">
        <h3>Category Breakdown</h3>
        <div className="category-table">
          <div className="category-table-header">
            <span>Category</span>
            <span>Spent</span>
            <span>Budget</span>
            <span>% of Total</span>
          </div>
          {categoryData.map((cat, index) => (
            <div key={cat.name} className="category-table-row">
              <span className="category-name">
                <span className="category-color" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </span>
              <span className="category-spent">{formatCurrency(cat.value)}</span>
              <span className="category-budget">{formatCurrency(cat.budget)}</span>
              <span className="category-percent">{cat.percentage.toFixed(1)}%</span>
            </div>
          ))}
          {categoryData.length === 0 && (
            <div className="category-table-empty">No expenses this month</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
