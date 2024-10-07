import {configureStore} from '@reduxjs/toolkit'
import expensesReducer from './features/expenses/expensesSlice'


// store setup
export const store = configureStore({
  reducer: {
    expenses: expensesReducer
  }
})

// code to intefer the initial state and dispatch types from the store.

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch