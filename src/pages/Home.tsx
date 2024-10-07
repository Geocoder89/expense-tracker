import React from 'react';
import ExpenseList from '../components/ExpenseList/ExpenseList';
import ExpenseChart from '../components/ExpenseChart/ExpenseChart';
import ExpenseSummary from '../components/ExpenseSummary/ExpenseSummary';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Expense Tracker
      </h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Search area */}
        <div className="col-span-1">
          <ExpenseSummary />
        </div>

        {/* Expense List area */}
        <div className="col-span-1">
          <ExpenseList />
        </div>

        {/* Chart area */}
        <div className="col-span-1">
          <ExpenseChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
