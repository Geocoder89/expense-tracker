import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  // Apply the dark mode class to the body on state change
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 dark:bg-[#19346b] text-gray-800 dark:text-white shadow-md transition-colors duration-300">
      <div className="flex space-x-4">

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="hover:underline  text-dark-blue dark:text-white">
            Hybrid Tracker
          </Link>
        </motion.div>
        
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="darkModeToggle"
          className="hidden"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        <label
          htmlFor="darkModeToggle"
          className="relative flex items-center justify-between w-14 h-7 p-1 bg-gray-300 dark:bg-gray-800 rounded-full cursor-pointer"
        >
          {/* Moon and Sun Icons */}
          <FaMoon className="text-gray-300 dark:text-gray-300" />
          <FaSun className="text-yellow-600" />
          <motion.span
            layout
            className="absolute w-6 h-6 bg-white rounded-full"
            initial={false}
            animate={{
              x: darkMode ? 24 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          ></motion.span>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
