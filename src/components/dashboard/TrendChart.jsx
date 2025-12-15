import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';
import { calculateMonthlyTotals, formatCurrency } from '../../utils/helpers';
import './TrendChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="trend-tooltip">
        <p className="trend-tooltip-label">{payload[0].payload.fullMonth}</p>
        <p className="trend-tooltip-value">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const TrendChart = () => {
  const { expenses } = useExpenses();

  const chartData = useMemo(() => {
    return calculateMonthlyTotals(expenses, 6);
  }, [expenses]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(d => d.total), 100);
  }, [chartData]);

  return (
    <div className="trend-chart-container">
      <h3 className="chart-title">Monthly Spending Trend</h3>
      <div className="trend-chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7551ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7551ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#7551ff"
              strokeWidth={3}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
