import { ReactNode } from 'react'

import {fireEvent, render, screen} from '@testing-library/react'
import configureStore, { MockStoreEnhanced } from 'redux-mock-store'
import ExpenseList from './ExpenseList'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom';
import { Expense } from '../../interfaces/Expense'



interface RootState {
  expenses: Expense[]
}


// create a mock store

const mockStore = configureStore<RootState>([])

describe('ExpenseList', ()=>{
 
  let store: MockStoreEnhanced<RootState>;
  const initialState: RootState = {expenses:[
    {id: '1', description: 'Groceries', amount: 50, category: 'Food' , date: '2024-10-5'},
    {id: '2', description: 'Movie Tickets', amount: 75, category: 'Entertainment' , date: '2024-10-6'}
  ]
}

  beforeEach(()=>{
    store = mockStore(initialState)
  })

  const renderWithProvider = (component: ReactNode)=> {
    return render(

    <Provider store={store}>
      <MemoryRouter>

      {component}
      </MemoryRouter>
      </Provider>)
  }

 

  it('should render the expense list',()=> {
    renderWithProvider(<ExpenseList/>)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText(/2024-10-0?5/)).toBeInTheDocument();


    expect(screen.getByText('Movie Tickets')).toBeInTheDocument()
    expect(screen.getByText('Entertainment')).toBeInTheDocument()
    expect(screen.getByText('$75')).toBeInTheDocument()
    expect(screen.getByText(/2024-10-0?6/)).toBeInTheDocument();
    
  })

  it('should call deleteExpense action with the correct id when confirmed',async ()=> {
    store.dispatch = jest.fn()

    // The modal root is present in the document


    const modalRoot = document.createElement('div')
    modalRoot.id = 'modal-root'
    document.body.appendChild(modalRoot)
    renderWithProvider(<ExpenseList/>)

    const deleteButton = screen.getAllByText('Delete', {selector: 'button'})[0]
    fireEvent.click(deleteButton)

    // click the confirm button in the modal

    const confirmationButton = await screen.findByText('Yes, Delete')
    fireEvent.click(confirmationButton)

    // check if the correct action was dispatched with the correct id

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'expenses/deleteExpense',
      payload: '1'
    })
    // clean up after the test by removing modal

    document.body.removeChild(modalRoot)
  })

  it('should show a message when no expenses are available', () => {
    store = mockStore({expenses: []})
    renderWithProvider(<ExpenseList/>);
    expect(screen.getByText(/No Expenses found./i)).toBeInTheDocument(); 
  });


  it('should render without crashing', () => {
    renderWithProvider(<ExpenseList />);
    expect(screen.getByText(/Expense List/i)).toBeInTheDocument(); 
  });

  it('should render the correct number of expenses', () => {
    renderWithProvider(<ExpenseList />);
    expect(screen.getAllByText(/Groceries|Movie Tickets/i)).toHaveLength(2); // Adjust based on expected output
  });
})