import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
} from 'recharts';

const ExpenseChart: React.FC = () => {
  const expenses = useSelector((state: RootState) => state.expenses);

  // Group expenses by date for the line chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expensesByDate = expenses.reduce((acc: any, expense: any) => {
    const date = new Date(expense.date).toLocaleDateString();

    if (!acc[date]) {
      acc[date] = 0;
    }

    acc[date] += expense.amount;

    return acc;
  }, {});

  const lineChartData = Object.entries(expensesByDate).map(([date, total]) => ({
    date,
    total,
  }));

  // Group expenses by category for the PieChart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expensesByCategory = expenses.reduce((acc: any, expense: any) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount; // Sum up expenses for the same category
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, total]) => ({
      category,
      total,
    })
  );

  // Define colors for pie chart
  const COLORS = ['#4B9CD3', '#F39C12', '#2ECC71', '#E74C3C', '#8E44AD'];

  return (
    <div className="flex flex-col space-y-8">
      {/* Line Chart for Expenses Over Time */}
      <h2 className="text-xl font-semibold dark:text-white text-center">
        Expenses Overview
      </h2>
      <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-4">
        <div className="flex-1 mb-4 md:mb-0">
          <h3 className="text-xl font-semibold dark:text-white text-center mb-4">
            Expenses Over Time
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#A0AEC0' }} // Light gray color for tick labels
              />
              <YAxis
                tick={{ fill: '#A0AEC0' }} // Light gray color for tick labels
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} // Dark background for tooltip
                labelStyle={{ color: '#E2E8F0' }} // Light color for label
                itemStyle={{ color: '#E2E8F0' }} // Light color for items in tooltip
              />
              <Line type="monotone" dataKey="total" stroke="#4A90E2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Expenses by Category */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold dark:text-white text-center mb-4">
            Expenses by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieChartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} // Dark background for tooltip
                labelStyle={{ color: '#E2E8F0' }} // Light color for label
                itemStyle={{ color: '#E2E8F0' }} // Light color for items in tooltip
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
