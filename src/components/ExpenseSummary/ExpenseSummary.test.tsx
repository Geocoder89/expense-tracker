
import { configureStore } from '@reduxjs/toolkit';
import ExpenseSummary from './ExpenseSummary'; 
import expensesReducer from '../../features/expenses/expensesSlice'; // Adjust the import path as necessary

import { Provider } from 'react-redux';
import { render,screen } from '@testing-library/react';
import { RootState } from '../../store';



const renderWithProvider = (
  ui: React.ReactElement,
  { initialState }: { initialState?: Partial<RootState> } = {}
) => {
  const store = configureStore({
    reducer: { expenses: expensesReducer },
    preloadedState: { expenses: initialState?.expenses || [] },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

describe('ExpenseSummary', () => {
  // Mock localStorage
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'expenses') {
            return JSON.stringify([
              { id: '1', description: 'Groceries', amount: 50, date: '2024-01-01', category: 'Food' },
              { id: '2', description: 'Gas', amount: 30, date: '2024-01-02', category: 'Transport' },
              { id: '3', description: 'Dinner', amount: 70, date: '2024-01-03', category: 'Food' },
            ]);
          }
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should render total amount as $0.00 when no expenses are available', () => {
    localStorage.getItem = jest.fn(() => JSON.stringify([])); // Mock empty expenses

    renderWithProvider(<ExpenseSummary />);

    expect(screen.getByText(/total amount:/i)).toHaveTextContent('$0.00');
  });

  it('should render the total amount and categorized expenses correctly', () => {
    const initialState = {
      expenses: [
        { 
          id: '1', 
          description: 'Groceries',
          amount: 120.00, 
          date: '2024-10-06',
          category: { value: 'Food', label: 'Food' }
        },
        { 
          id: '2', 
          description: 'Bus fare',
          amount: 30.00, 
          date: '2024-10-06',
          category: { value: 'Transport', label: 'Transport' }
        },
      ],
    };

    renderWithProvider(<ExpenseSummary />, { initialState });

    // Check that total amount is displayed correctly
    expect(screen.getByText(/total amount:/i)).toHaveTextContent('$150.00');

  // Check that total amount is displayed correctly
  expect(screen.getByText(/total amount:/i)).toHaveTextContent('$150.00');

  // Check that categorized expenses are displayed correctly
  expect(screen.getByText(/food/i)).toBeInTheDocument(); // Check for the category
  expect(screen.getByText(/transport/i)).toBeInTheDocument(); // Check for the category

  // Check that amounts are displayed correctly
  expect(screen.getByText(/food/i).closest('li')).toHaveTextContent('$120.00'); // Get the closest <li> and check for amount
  expect(screen.getByText(/transport/i).closest('li')).toHaveTextContent('$30.00'); // Get the closest <li> and check for amount
  });

  it('should not crash and display nothing when expenses are not present', () => {
    localStorage.getItem = jest.fn(() => null); // Mock null expenses

    renderWithProvider(<ExpenseSummary />);

    expect(screen.queryByText(/food/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/transport/i)).not.toBeInTheDocument();
    expect(screen.getByText(/total amount:/i)).toHaveTextContent('$0.00');
  });
});

