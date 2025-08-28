

'use client';

interface SignUpDialogProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';

const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, onClose, onSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { signup, isLoading, error } = useAuth();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [horizontalPadding, setHorizontalPadding] = useState('64px');

  useEffect(() => {
    const handleResize = () => {
      setHorizontalPadding(window.innerWidth < 640 ? '32px' : '64px');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await signup.mutateAsync({ email: formData.email, password: formData.password });
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Account created!');
      onClose();
    } catch (err) {
      const msg = (err as Error)?.message || 'Sign up failed';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
        }
      }}
    >
      {/* Title */}
      <h2
        className="text-deepblue font-bold mb-8 text-center"
        style={{ fontSize: '28px' }}
      >
        Sign Up
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            className="block text-deepblue mb-2"
            style={{ fontSize: '16px' }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-4 rounded-[12px] border border-gray-300 text-deepblue placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors"
            style={{
              background: '#f8fafc',
              fontSize: '14px',
            }}
            placeholder="Email address"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="text-deepblue"
              style={{ fontSize: '16px' }}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 cursor-pointer"
              style={{ color: '#888' }}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              <span style={{ fontSize: '16px' }}>
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-4 rounded-[12px] border border-gray-300 text-deepblue placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors"
            style={{
              background: '#f8fafc',
              fontSize: '14px',
            }}
            placeholder="Password"
            required
          />
        </div>

        {/* Error message */}
        {(formError || error) && (
          <div className="text-red-500 text-center text-sm">{formError || error?.message}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || submitting}
          className="w-full py-4 rounded-[12px] bg-green-400 text-deepblue font-bold text-lg transition-all duration-200 cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {submitting ? 'Please wait...' : 'Sign Up'}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <span
            className="text-deepblue"
            style={{ fontSize: '14px' }}
          >
            {'Already have an account? '}
          </span>
          <button
            type="button"
            onClick={onSignIn}
            className="underline hover:opacity-80 transition-colors duration-200 cursor-pointer"
            style={{ fontSize: '14px' }}
          >
            Sign In
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default SignUpDialog;