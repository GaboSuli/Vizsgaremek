import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.jsx';

export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // Returns: { isDarkMode, mode, theme, toggleTheme }
  return context;
}

export { ThemeContext };
