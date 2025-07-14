"use client";

import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose, onBack }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Placeholder: Simulate success, comment out actual mutation
      // await useAuth().forgotPassword({ email });
      setTimeout(() => {
        setSuccess(true);
        toast.success('Password reset email sent!');
        setSubmitting(false);
      }, 500);
      return;
    } catch (err) {
      // setError((err as Error)?.message || 'Failed to send email');
      // toast.error(error || 'Failed to send email');
    } finally {
      // setSubmitting(false);
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
          paddingTop: '56px',
          paddingBottom: '56px',
          maxWidth: '448px',
          paddingLeft: '64px',
          paddingRight: '64px',
        }
      }}
    >
      <h2 className="text-deepblue font-bold mb-8 text-center" style={{ fontSize: '28px' }}>
        Forgot Password
      </h2>
      {success ? (
        <div className="space-y-6">
          <div className="text-green-600 text-center text-lg font-semibold">Password reset email sent!</div>
          <div className="text-yellow-600 text-center text-sm">Check your spam folder if you don't see the email in your inbox.</div>
          <button
            type="button"
            className="w-full py-4 rounded-[12px] bg-gold text-deepblue font-bold text-lg transition-all duration-200 cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gold"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-deepblue mb-2" style={{ fontSize: '16px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-[12px] border border-gray-300 text-deepblue placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors"
              style={{ background: '#f8fafc', fontSize: '14px' }}
              placeholder="Email address"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-[12px] bg-gold text-deepblue font-bold text-lg transition-all duration-200 cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {submitting ? 'Please wait...' : 'Send Reset Email'}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="underline hover:opacity-80 transition-colors duration-200 cursor-pointer"
              style={{ fontSize: '14px', color: '#888' }}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
};

export default ForgotPasswordDialog;
