'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import SignInDialog from '@/components/auth/LoginComponent'
import SignUpDialog from '@/components/auth/SignUpComponent'
import ForgotPasswordDialog from '@/components/auth/ForgotPasswordComponent'

const AuthDialog: React.FC = () => {
  const { isDialogOpen, dialogType, closeDialog, switchDialog } = useAuth()

  if (!isDialogOpen || !dialogType) return null

  const renderDialog = () => {
    switch (dialogType) {
      case 'signin':
        return (
          <SignInDialog
            open={isDialogOpen}
            onClose={closeDialog}
            onForgotPassword={() => switchDialog('forgot-password')}
            onSignUp={() => switchDialog('signup')}
          />
        )
      case 'signup':
        return (
          <SignUpDialog
            open={isDialogOpen}
            onClose={closeDialog}
            onSignIn={() => switchDialog('signin')}
          />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordDialog
            open={isDialogOpen}
            onClose={closeDialog}
            onBack={() => switchDialog('signin')}
          />
        )
      default:
        return null
    }
  }

  return renderDialog()
}

export default AuthDialog