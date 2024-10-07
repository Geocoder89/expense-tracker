import React from 'react'

interface ExpenseSearchProps {
  searchTerm: string;
  onSearch: (term: string)=> void;
}

const ExpenseSearch: React.FC<ExpenseSearchProps> = ({searchTerm,onSearch}) => {

 
  return (
    <div>
      <input type='text' name='search' placeholder='Search expenses....' value={searchTerm} onChange={(e)=> onSearch(e.target.value)} className='px-4 py-2 border rounded w-full max-w-md shadow-sm focus:outline-none focus:border-dark-blue'
      autoComplete="on"
      />
    </div>
  )
}

export default ExpenseSearch