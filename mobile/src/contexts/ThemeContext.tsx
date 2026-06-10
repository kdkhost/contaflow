import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#000000',
  bgCard: '#1a1a2e',
  bgInput: '#16213e',
  bgHeader: '#0a0a1a',
  bgSidebar: '#0a0a1a',
  bgModal: '#0f0f23',
  border: '#4a5568',
  borderInput: '#718096',
  text: '#ffffff',
  textSecondary: '#f1f5f9',
  textMuted: '#cbd5e1',
  primary: '#a78bfa',
  primaryLight: '#c4b5fd',
  accent: '#67e8f9',
  success: '#6ee7b7',
  danger: '#fca5a5',
  warning: '#fcd34d',
  info: '#93c5fd',
};

const lightColors = {
  bg: '#f8fafc',
  bgCard: '#ffffff',
  bgInput: '#ffffff',
  bgHeader: '#ffffff',
  bgSidebar: '#ffffff',
  bgModal: '#ffffff',
  border: '#cbd5e1',
  borderInput: '#94a3b8',
  text: '#020617',
  textSecondary: '#1e293b',
  textMuted: '#475569',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  accent: '#06b6d4',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme === 'light' ? 'light' : 'dark');

  useEffect(() => {
    if (systemScheme) setTheme(systemScheme);
  }, [systemScheme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      isDark: theme === 'dark',
      colors: theme === 'dark' ? darkColors : lightColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
