'use client'

import React, { createContext, useContext, useState, useCallback } from 'react';

export type AuthDialogType = 'signin' | 'signup' | 'forgot-password' | 'otp';

interface AuthContextProps {
  isDialogOpen: boolean;
  dialogType: AuthDialogType | null;
  openDialog: (type: AuthDialogType) => void;
  closeDialog: () => void;
  switchDialog: (type: AuthDialogType) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<AuthDialogType | null>(null);
  const [setAuthUser] = useState<string | null>(null);
  const openDialog = useCallback((type: AuthDialogType) => {
    setDialogType(type);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setDialogType(null);
  }, []);

  const switchDialog = useCallback((type: AuthDialogType) => {
    setDialogType(type);
  }, []);

  return (
    <AuthContext.Provider value={{ isDialogOpen, dialogType, openDialog, closeDialog, switchDialog }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
