import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeVariant = 'default' | 'emerald' | 'purple' | 'rose' | 'amber' | 'indigo' | 'teal';

interface ThemeContextType {
  darkMode: boolean;
  theme: ThemeVariant;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setTheme: (theme: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [theme, setThemeState] = useState<ThemeVariant>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeVariant;
    return savedTheme || 'default';
  });

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('theme-default', 'theme-emerald', 'theme-purple', 'theme-rose', 'theme-amber', 'theme-indigo', 'theme-teal');

    // Add current theme class
    if (theme !== 'default') {
      root.classList.add(`theme-${theme}`);
    }

    // Handle dark mode
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }

    // Save theme
    localStorage.setItem('theme', theme);
  }, [darkMode, theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((newTheme: ThemeVariant) => {
    setThemeState(newTheme);
  }, []);

  const value = {
    darkMode,
    theme,
    toggleDarkMode,
    setDarkMode,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};