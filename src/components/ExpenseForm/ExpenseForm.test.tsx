import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ExpenseForm from './ExpenseForm'; // Your form component
import { RootState } from '../../store';
import { editExpense, addExpense } from '../../features/expenses/expensesSlice'; // Import addExpense action

// Mock store
const mockStore = configureStore<RootState>([]);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import other exports from react-router-dom
  useParams: jest.fn(), // Mock useParams
}));

const mockedUseParams = useParams as jest.Mock;

describe('ExpenseForm', () => {
  let store: MockStoreEnhanced<RootState>;

  const renderWithProvider = (component: ReactNode) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={component} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  // Set an initial empty state before each test
  beforeEach(() => {
    store = mockStore({ expenses: [] });
  });

  it('should render the form for adding an expense', () => {
    renderWithProvider(<ExpenseForm />);

    // Check that the description input is rendered
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

    // Check that the amount input is rendered
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

    // Check that the category dropdown is rendered
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();

    // Check that the date picker is rendered
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();

    // Check that the submit button is rendered
    expect(
      screen.getByRole('button', { name: /add expense/i })
    ).toBeInTheDocument();
  });

  it('should display validation errors when form is submitted empty', async () => {
    renderWithProvider(<ExpenseForm />);

    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a valid positive amount/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
      // Check if the date input or label is highlighted as invalid
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });
  });

  it('should submit the form with valid data', async () => {
    renderWithProvider(<ExpenseForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Groceries' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '50' },
    });

    // Select a category (assuming category is now an object with value and label)
    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    fireEvent.click(screen.getByText(/Food/i)); // Click the category option

    // Set a date
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2023-10-06' }, // Ensure this matches your date input handling
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

    await waitFor(() => {
      // Ensure the appropriate actions were dispatched
      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0].type).toBe(addExpense.type); // Ensure addExpense action is dispatched
      expect(actions[0].payload).toMatchObject({
        description: 'Groceries',
        amount: 50,
        date: expect.any(String),
        category: {
          value: 'Food', 
          label: 'Food',
        },
      });
    });
  });

  it('should dispatch editExpense action with correct data when editing', async () => {
    const existingExpense = {
      id: '1',
      description: 'Utilities',
      amount: 100,
      category: {
        value: 'Others',
        label: 'Others',
      },
      date: '2023-10-06',
    };

    mockedUseParams.mockReturnValue({ id: '1' });

    // Set the existing expense in the mock store
    store = mockStore({ expenses: [existingExpense] });

    // Mock the useParams to return the ID of the existing expense
    mockedUseParams.mockReturnValue({ id: '1' });

    renderWithProvider(<ExpenseForm />);

    // Ensure the existing data is pre-filled
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      existingExpense.description
    );

    // Convert amount to string in the expectation
    expect(screen.getByLabelText(/amount/i)).toHaveValue(
      existingExpense.amount
    );

    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    const othersOption = screen.getAllByText(/Others/i);
    expect(othersOption.length).toBeGreaterThan(0); // Ensure "Others" exists
    fireEvent.click(othersOption[0]);

    // Set the date
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2023-10-06' },
    });

    // Click the update button to submit the form
    fireEvent.click(screen.getByRole('button', { name: /update expense/i })); // Ensure this matches your button label

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0].type).toBe(editExpense.type); // Ensure editExpense action is dispatched
      expect(actions[0].payload).toMatchObject({
        id: existingExpense.id,
        description: 'Utilities',
        amount: existingExpense.amount, // amount is already a number, this is fine
        category: {
          value: 'Others',
          label: 'Others',
        },
        date: '2023-10-06',
      });
    });
  });


 
  
});
