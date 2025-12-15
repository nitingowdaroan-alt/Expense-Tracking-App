import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES, CHART_COLORS } from '../../utils/constants';
import { calculateTotalByCategory, filterExpensesByMonth, formatCurrency } from '../../utils/helpers';
import './SpendingChart.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p className="tooltip-value">{formatCurrency(data.value)}</p>
        <p className="tooltip-percent">{data.percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const SpendingChart = () => {
  const { expenses, selectedMonth } = useExpenses();

  const chartData = useMemo(() => {
    const monthExpenses = filterExpensesByMonth(expenses, selectedMonth);
    const totals = calculateTotalByCategory(monthExpenses);
    const totalAmount = Object.values(totals).reduce((sum, val) => sum + val, 0);

    return CATEGORIES
      .filter(cat => totals[cat.id] > 0)
      .map((cat, index) => ({
        name: cat.name,
        value: totals[cat.id] || 0,
        percentage: totalAmount > 0 ? ((totals[cat.id] || 0) / totalAmount) * 100 : 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [expenses, selectedMonth]);

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Spending by Category</h3>
        <div className="chart-empty">
          <p>No expenses this month</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Spending by Category</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="legend-label">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
