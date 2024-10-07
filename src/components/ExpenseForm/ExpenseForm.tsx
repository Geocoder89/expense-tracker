import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addExpense, editExpense } from '../../features/expenses/expensesSlice';
import { categoryOptions } from '../../constants/CategoryOptions';
const ExpenseForm = () => {
  const { id } = useParams<{ id?: string }>() || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // select expense from Redux store based on ID if it is an edit operation

  const existingExpense = useSelector((state: RootState) =>
    id ? state.expenses.find((expense) => expense.id === id) : null
  );

  // set initial form state

  const [description, setDescription] = useState(
    existingExpense?.description || ''
  );
  const [amount, setAmount] = useState<string | number>(
    existingExpense?.amount ? existingExpense.amount.toString() : ''
  );


  const [category, setCategory] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
    category?: string;
    date?: string;
  }>({});

  const parseDate = (dateString: string): Date | null => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Returns null if invalid date
  };

  // prepopulate the existing expenses if there is one existing.
  useEffect(() => {
    if (existingExpense) {
      setDescription(existingExpense.description);
      setAmount(existingExpense.amount);
      if (typeof existingExpense.category === 'string') {
        setCategory({
          value: existingExpense.category,
          label: existingExpense.category,
        });
      } else {
        setCategory(existingExpense.category);
      }
      setDate(parseDate(existingExpense.date)); // Parse and set the date
    }
  }, [existingExpense]);

  // Validate the form fields

  const validateForm = () => {
    const formErrors: {
      description?: string;
      amount?: string;
      category?: string;
      date?: string;
    } = {};

    if (!description.trim()) {
      formErrors.description = 'Description is required';
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      formErrors.amount = 'Please enter a valid positive amount';
    }

    if (
      !category ||
      !categoryOptions.some((option) => option.value === category.value)
    ) {
      formErrors.category = 'Please select a category';
    }
    if (!date) {
      formErrors.date = 'Please select a date';
    }

    return formErrors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // validate  the form before submitting with our helper method
    const formErrors = validateForm();

    setErrors(formErrors);

    // if there are no errors proceed with the form submission either to add or update an expense

    if (Object.keys(formErrors).length === 0) {
      const expenseData = {
        id: id ? id : uuidv4(),
        description: description.trim(),
        amount: Number(amount), 
        date: date
          ? date.toLocaleDateString('en-CA')
          : new Date().toLocaleDateString('en-CA'),
        category: category
          ? { value: category.value, label: category.label }
          : '',
      };

      // if an id exists edit else add the expense
      if (id) {
        dispatch(editExpense(expenseData));
      } else {
        dispatch(addExpense(expenseData));
      }
      navigate('/');
    }
  };
  

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-dark-blue hover:text-dark-secondary dark:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-dark-blue dark:text-white">
        {id ? `Edit ${existingExpense?.description}` : `Add Expense`}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium mb-1 text-dark-blue dark:text-white"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            autoComplete="description"
            className={`w-full p-2 border rounded ${
              errors.description ? 'border-red-500' : ''
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block font-medium mb-1 text-dark-blue  dark:text-white"
          >
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            className={`w-full p-2 border rounded ${
              errors.amount ? 'border-red-500' : ''
            }`}
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              setAmount(value === '' ? '' : Number(value)); // Set to empty string when cleared
            }}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block font-medium mb-1  text-dark-blue  dark:text-white"
          >
            category
          </label>
          <Select
            id="category"
            options={categoryOptions}
            value={category}
            onChange={(selectedOption) => {
              setCategory(selectedOption);
            }}
            className={`w-full ${errors.category ? 'border-red-500' : ''}`}
            classNamePrefix="react-select"
            placeholder="Select or type to add a category"
            isClearable
            isSearchable
            name="category"
            noOptionsMessage={() => 'Type to add a new category'}
            data-testid="category-select"
            aria-label="category"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        {/* Date field */}
        <div>
          <label
            id="date-label"
            htmlFor="date"
            className="block font-medium mb-1  text-dark-blue  dark:text-white"
          >
            Date
          </label>
          <DatePicker
            ariaLabelledBy="date-label"
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            className={`w-full p-2 border rounded ${
              errors.date ? 'border-red-500' : ''
            }`}
            placeholderText="Select a date"
            calendarClassName="custom-calendar"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        {/* Button to submit */}

        <button
          type="submit"
          className="bg-dark-blue text-white border border-white px-4 py-2 rounded-md hover:bg-dark-secondary transition-colors duration-300"
        >
          {id ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
