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
import { Expense } from './Expense'; // Adjust the import according to your structure

const ExpenseChart: React.FC = () => {
  const expenses = useSelector((state: RootState) => state.expenses);

  // Group expenses by date for the line chart
  const expensesByDate = expenses.reduce((acc: Record<string, number>, expense: Expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {});

  const lineChartData = Object.entries(expensesByDate).map(([date, total]) => ({
    date,
    total,
  }));

  // Group expenses by category for the PieChart
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense: Expense) => {
    // Determine the category based on its type
    const category: string = typeof expense.category === 'string' 
      ? expense.category 
      : expense.category.value; // If it's a Category object, use the `value`

    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory)
    .filter(([_category, total]) => total > 0) // Ensure we only include non-zero totals
    .map(([category, total]) => ({
      category,
      total,
    }));

  // Define colors for pie chart
  const COLORS = ['#4B9CD3', '#F39C12', '#2ECC71', '#E74C3C', '#8E44AD'];

  if (expenses.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold dark:text-white">
          No Expenses Added
        </h2>
        <p className="text-gray-500">
          Please add some expenses to see the charts.
        </p>
      </div>
    );
  }

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
              <XAxis dataKey="date" tick={{ fill: '#A0AEC0' }} />
              <YAxis tick={{ fill: '#A0AEC0' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#E2E8F0' }}
                itemStyle={{ color: '#E2E8F0' }}
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
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#E2E8F0' }}
                itemStyle={{ color: '#E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
