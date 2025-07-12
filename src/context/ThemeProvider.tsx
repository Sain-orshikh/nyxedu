import React from 'react';
import { Provider as JotaiProvider, atom, useAtom } from 'jotai';

// Jotai atoms
export const themeAtom = atom<'light' | 'dark'>('light');

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <JotaiProvider>{children}</JotaiProvider>;
};

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  return { theme, setTheme };
};
