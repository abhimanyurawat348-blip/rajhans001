import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DesignSystemContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  borderRadius: 'sm' | 'md' | 'lg' | 'xl';
  setBorderRadius: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  animationSpeed: 'slow' | 'normal' | 'fast';
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

export const DesignSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [borderRadius, setBorderRadius] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('rhps-theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Check for saved design preferences
    const savedFont = localStorage.getItem('rhps-font-family');
    if (savedFont) setFontFamily(savedFont);

    const savedBorderRadius = localStorage.getItem('rhps-border-radius');
    if (savedBorderRadius) setBorderRadius(savedBorderRadius as 'sm' | 'md' | 'lg' | 'xl');

    const savedAnimationSpeed = localStorage.getItem('rhps-animation-speed');
    if (savedAnimationSpeed) setAnimationSpeed(savedAnimationSpeed as 'slow' | 'normal' | 'fast');
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rhps-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateFontFamily = (font: string) => {
    setFontFamily(font);
    localStorage.setItem('rhps-font-family', font);
  };

  const updateBorderRadius = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setBorderRadius(size);
    localStorage.setItem('rhps-border-radius', size);
  };

  const updateAnimationSpeed = (speed: 'slow' | 'normal' | 'fast') => {
    setAnimationSpeed(speed);
    localStorage.setItem('rhps-animation-speed', speed);
  };

  return (
    <DesignSystemContext.Provider value={{
      theme,
      toggleTheme,
      fontFamily,
      setFontFamily: updateFontFamily,
      borderRadius,
      setBorderRadius: updateBorderRadius,
      animationSpeed,
      setAnimationSpeed: updateAnimationSpeed
    }}>
      <div 
        className={`${fontFamily.toLowerCase()}-font`}
        style={{ 
          // Apply border radius variables
          ['--border-radius-sm' as any]: borderRadius === 'sm' ? '0.25rem' : 
                                         borderRadius === 'md' ? '0.375rem' : 
                                         borderRadius === 'lg' ? '0.5rem' : '0.75rem',
          ['--border-radius-md' as any]: borderRadius === 'sm' ? '0.375rem' : 
                                         borderRadius === 'md' ? '0.5rem' : 
                                         borderRadius === 'lg' ? '0.75rem' : '1rem',
          ['--border-radius-lg' as any]: borderRadius === 'sm' ? '0.5rem' : 
                                         borderRadius === 'md' ? '0.75rem' : 
                                         borderRadius === 'lg' ? '1rem' : '1.5rem',
          // Apply animation speed variables
          ['--animation-speed' as any]: animationSpeed === 'slow' ? '1s' : 
                                        animationSpeed === 'normal' ? '0.5s' : '0.2s'
        }}
      >
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
};