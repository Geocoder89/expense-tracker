import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { deleteExpense } from '../../features/expenses/expensesSlice';
import { Link } from 'react-router-dom';
import ExpenseSearch from '../ExpenseSearch/ExpenseSearch';
import './ExpenseList.css';
// import category options for filtering

import { categoryOptions } from '../../constants/CategoryOptions';
import { motion } from 'framer-motion';
import Modal from '../../shared/UI/Modal';
const itemsPerPage = 5;

const ExpenseList: React.FC = () => {
  const expenses = useSelector((state: RootState) => state.expenses);
  const dispatch = useDispatch();

  // Component local state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Filter logic to filter by search term, category and date range.
  const filteredExpenses = expenses.filter(
    (expense) =>
      (expense.description ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
        (!selectedCategory || 
          (typeof expense.category === 'string' 
            ? expense.category === selectedCategory.value 
            : expense.category.value === selectedCategory.value)
        ) &&
      (!startDate || new Date(expense.date) >= startDate) &&
      (!endDate || new Date(expense.date) <= endDate)
  );

  // Pagination logic

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // method to delete expenses

  // 1. we first open the modal
  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setIsModalOpen(true);
  };
  // 2. on Confirm we delete the modal

  const confirmDelete = () => {
    if (expenseToDelete) {
      dispatch(deleteExpense(expenseToDelete)); // the redux method is called to delete the expense
    }

    setIsModalOpen(false); // close the modal
    setExpenseToDelete(null); // remove the id upon deletion
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExpenseToDelete(null); // Reset the expense to delete
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center text-dark-blue dark:text-white">
        Expense List
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Search Component */}
        <div className="w-full md:w-1/4">
          <ExpenseSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>

        {/* Category filter */}
        <div className="w-full md:w-1/4">
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            isClearable
            className="w-full"
            placeholder="Select Category"
          />
        </div>

        {/* Date pickers */}
        <div className="w-full md:w-1/4 flex space-x-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DatePicker
              selected={startDate ?? undefined}
              onChange={(date) => setStartDate(date as Date)}
              selectsStart
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              className="border rounded-md px-4 py-2 w-full bg-white text-black dark:bg-dark-blue dark:text-white dark:border-dark-secondary transition duration-300"
              placeholderText="Start Date"
              calendarClassName="custom-calendar"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DatePicker
              selected={endDate ?? undefined}
              onChange={(date) => setEndDate(date as Date)}
              selectsEnd
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              className="border rounded-md px-4 py-2 w-full bg-white text-black dark:bg-dark-blue dark:text-white dark:border-dark-secondary transition duration-300"
              placeholderText="End Date"
              calendarClassName="custom-calendar"
            />
          </motion.div>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/add-expense"
          className="bg-dark-blue text-white border border-white px-4 py-2 rounded-md hover:bg-dark-secondary transition-colors duration-300"
        >
          Add Expense
        </Link>
      </div>
      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 dark:text-gray-400 text-sm">
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-6 whitespace-nowrap">
                    {expense.description}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    ${expense.amount}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                  {typeof expense.category === 'string' ? expense.category : expense.category.label}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap flex space-x-4">
                    <Link
                      to={`/edit-expense/${expense.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(expense.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No Expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-4 py-2 border ${
                currentPage === index + 1
                  ? 'bg-dark-blue text-white'
                  : 'bg-white dark:bg-gray-700 text-dark-blue dark:text-white'
              } rounded-md`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* modal */}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title="Confirm Deletion"
          content={<p>Are you sure you want to delete this expense?</p>}
          onClose={closeModal}
          actions={[
            { label: 'Yes, Delete', onClick: confirmDelete },
            { label: 'Cancel', onClick: closeModal },
          ]}
        />
      )}
    </div>
  );
};

export default ExpenseList;
