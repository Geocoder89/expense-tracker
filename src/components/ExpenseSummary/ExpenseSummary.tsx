import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FaDollarSign, FaListAlt } from 'react-icons/fa';

interface Category {
  value: string;
  label: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string | Category; // category can be a string or a Category object
}

const ExpenseSummary: React.FC = () => {
  const expenses = useSelector((state: RootState) => state.expenses) || [];

  // Calculate total amount
  const totalAmount = expenses.reduce((total, expense: Expense) => {
    const amount = typeof expense.amount === 'number' ? expense.amount : 0;
    return total + amount;
  }, 0);



  // Categorize expenses
  const categorizedExpenses = expenses.reduce((acc, expense: Expense) => {
    let categoryKey = 'Unknown'; // Default category

    // Check if category is a string or an object
    if (typeof expense.category === 'string') {
      categoryKey = expense.category; // Directly use the string
    } else if (typeof expense.category === 'object' && expense.category !== null) {
      categoryKey = expense.category.value; // Use category.value for the object
    }

    if (!acc[categoryKey]) {
      acc[categoryKey] = 0;
    }
    acc[categoryKey] += expense.amount || 0; // Fallback to 0 if amount is undefined
    return acc;
  }, {} as Record<string, number>);

 

  return (
    <div className="p-6 bg-white shadow-md rounded-md dark:bg-slate-800 transition duration-300 ease-in-out">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-200">
        <FaListAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
        Expense Summary
      </h2>
      <p className="text-lg font-semibold mb-2 flex items-center text-gray-800 dark:text-gray-200">
        <FaDollarSign className="mr-2 text-emerald-500 dark:text-emerald-400" />
        Total Amount: ${totalAmount.toFixed(2)}
      </p>
      <ul className="space-y-1">
        {Object.keys(categorizedExpenses).map((category) => (
          <li key={category} className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">{category}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              ${categorizedExpenses[category].toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseSummary;
