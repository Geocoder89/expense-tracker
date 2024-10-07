import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { Expense } from '../../interfaces/Expense'


// function to initialize array state
const loadExpenses = (): Expense[]=>{
  const savedExpenses = localStorage.getItem('expenses')

  return savedExpenses ? JSON.parse(savedExpenses): []
}

// function to save created expenses into local storage

const savedExpenses = (expenses: Expense[])=>{
  localStorage.setItem('expenses', JSON.stringify(expenses))
}


const expensesSlice = createSlice({
  name: 'expenses',
  initialState: loadExpenses(),
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>)=>{
      state.push(action.payload)
      savedExpenses(state)
    },
    editExpense: (state, action: PayloadAction<Expense>)=> {
      // get the expense by it's index
      const index = state.findIndex(expense => expense.id === action.payload.id)

      // if index is found, edit the expense
      if(index !== -1 ) {
        state[index] = action.payload
        // save edited expense into local storage
        savedExpenses(state)
      }
    },

    deleteExpense: (state, action: PayloadAction<string>)=>{
      // get the expense by it's index
      const index = state.findIndex(expense => expense.id === action.payload)

      if(index !== -1 ) {
        // remove by it's index
       state.splice(index, 1)
        // save edited expense into local storage
        savedExpenses(state)
      }
    }
  }
})
// export action creators 

export const {addExpense, editExpense, deleteExpense} = expensesSlice.actions

export default expensesSlice.reducer