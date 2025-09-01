"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from '@mui/material';
import toast from 'react-hot-toast';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
}

type Step = 'email' | 'otp' | 'newPassword' | 'success';

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose, onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  // Refs for OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setEmail('');
      setOtp(['', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentStep('email');
      setError(null);
      setEmailError('');
      setSubmitting(false);
    }
  }, [open]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    
    // Validate email format in real-time
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError('');

    // Validate email format
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a user not found error
        if (response.status === 404 && data.error === 'User not found') {
          setEmailError('No account found with this email address');
          toast.error('No account found with this email address');
        } else {
          const errorMessage = data.error || 'Failed to send reset code';
          setError(errorMessage);
          toast.error(errorMessage);
        }
        return;
      }

      toast.success('Reset code sent to your email!');
      setCurrentStep('otp');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is exactly 4 digits
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus the last input
      otpRefs.current[3]?.focus();
    } else if (/^\d+$/.test(pastedData) && pastedData.length <= 4) {
      // Handle partial digit paste
      const digits = pastedData.split('');
      const newOtp = [...otp];
      
      for (let i = 0; i < digits.length && (index + i) < 4; i++) {
        newOtp[index + i] = digits[i];
      }
      
      setOtp(newOtp);
      
      // Focus next available input or last filled input
      const nextIndex = Math.min(index + digits.length, 3);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired code');
      }

      toast.success('Code verified successfully!');
      setCurrentStep('newPassword');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid or expired code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp: otp.join(''), 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast.success('Password reset successfully!');
      setCurrentStep('success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
    } else if (currentStep === 'newPassword') {
      setCurrentStep('otp');
    } else {
      onBack();
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a user not found error
        if (response.status === 404 && data.error === 'User not found') {
          setError('No account found with this email address');
          toast.error('No account found with this email address');
        } else {
          const errorMessage = data.error || 'Failed to resend code';
          setError(errorMessage);
          toast.error(errorMessage);
        }
        return;
      }

      toast.success('New code sent to your email!');
      setOtp(['', '', '', '']);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Forgot Password';
      case 'otp':
        return 'Enter Verification Code';
      case 'newPassword':
        return 'Create New Password';
      case 'success':
        return 'Password Reset Successful';
      default:
        return 'Forgot Password';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          background: '#fff',
          borderRadius: '16px',
          paddingTop: '40px',
          paddingBottom: '40px',
          maxWidth: '448px',
          paddingLeft: '64px',
          paddingRight: '64px',
        }
      }}
    >
      <h2 className="text-deepblue font-bold mb-8 text-center" style={{ fontSize: '28px' }}>
        {getStepTitle()}
      </h2>

      {currentStep === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label className="block text-deepblue mb-2" style={{ fontSize: '16px' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 rounded-[12px] border ${emailError ? 'border-red-500' : 'border-gray-300'} text-deepblue placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors`}
              style={{ background: '#f8fafc', fontSize: '14px' }}
              placeholder="Enter your email address"
              required
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Verification Code'}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleBack}
              className="underline hover:opacity-80 transition-colors duration-200 cursor-pointer"
              style={{ fontSize: '14px', color: '#888' }}
            >
              Back to Log In
            </button>
          </div>
        </form>
      )}

      {currentStep === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="text-center text-gray-600 mb-6">
            We sent a 4-digit verification code to<br />
            <span className="font-semibold text-deepblue">{email}</span>
          </div>
          
          <div>
            <label className="block text-deepblue mb-4 text-center" style={{ fontSize: '16px' }}>
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  onPaste={e => handleOtpPaste(e, index)}
                  className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  style={{ background: '#f8fafc' }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Tip: You can paste a 4-digit code directly
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={submitting}
              className="text-green-600 hover:text-green-700 underline transition-colors duration-200 cursor-pointer text-sm"
            >
              Resend Code
            </button>
            <br />
            <button
              type="button"
              onClick={handleBack}
              className="underline hover:opacity-80 transition-colors duration-200 cursor-pointer"
              style={{ fontSize: '14px', color: '#888' }}
            >
              Back to Email
            </button>
          </div>
        </form>
      )}

      {currentStep === 'newPassword' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-deepblue mb-2" style={{ fontSize: '16px' }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-gray-300 text-deepblue placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors"
              style={{ background: '#f8fafc', fontSize: '14px' }}
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-deepblue mb-2" style={{ fontSize: '16px' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-gray-300 text-deepblue placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors"
              style={{ background: '#f8fafc', fontSize: '14px' }}
              placeholder="Confirm new password"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBack}
              className="underline hover:opacity-80 transition-colors duration-200 cursor-pointer"
              style={{ fontSize: '14px', color: '#888' }}
            >
              Back to Verification
            </button>
          </div>
        </form>
      )}

      {currentStep === 'success' && (
        <div className="space-y-6 text-center">
          <div className="text-green-600 text-lg font-semibold">
            🎉 Password Reset Successful!
          </div>
          <div className="text-gray-600">
            Your password has been successfully reset. You can now log in with your new password.
          </div>
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            onClick={() => {
              onClose();
              onBack(); // This will switch back to login
            }}
          >
            Go to Log In
          </button>
        </div>
      )}
    </Dialog>
  );
};

export default ForgotPasswordDialog;
