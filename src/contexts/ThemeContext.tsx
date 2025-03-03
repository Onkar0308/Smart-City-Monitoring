import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAccessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isAccessibilityMode, setIsAccessibilityMode] = useState(() => {
    const saved = localStorage.getItem('accessibilityMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('accessibilityMode', JSON.stringify(isAccessibilityMode));
    if (isAccessibilityMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
  }, [isAccessibilityMode]);

  const toggleDarkMode = () => setIsDarkMode((prev: boolean) => !prev);
  const toggleAccessibilityMode = () => setIsAccessibilityMode((prev: boolean) => !prev);

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      isAccessibilityMode,
      toggleAccessibilityMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}