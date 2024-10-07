import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Home from './pages/Home';
import { motion } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import EditExpense from './pages/EditExpense';
import AddExpense from './pages/AddExpense';

const App: React.FC = () => {
  // Initialize dark mode state based on localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

 
  return (
    <motion.div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'dark:bg-dark-secondary' : 'bg-white'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/add-expense' element={<AddExpense/>}/>
        <Route path='/edit-expense/:id' element={<EditExpense/>}/>
      </Routes>
    </motion.div>
  );
};

export default App;
