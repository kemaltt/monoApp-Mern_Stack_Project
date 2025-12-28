import React from 'react';
import { motion } from 'framer-motion';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

/**
 * Theme Switcher Toggle Component
 */
const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute top-1 flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md"
        animate={{
          left: isDark ? 'calc(100% - 28px)' : '4px',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <MdDarkMode className="text-yellow-400 text-sm" />
        ) : (
          <MdLightMode className="text-yellow-500 text-sm" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
