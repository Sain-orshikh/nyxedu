"use client";

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/context/AuthContext';
import { useAuth as useAuthMutation } from '@/hooks/useAuth';
import ProfileDropdown from '@/components/ProfileDropdown';
import toast from 'react-hot-toast';
import { FiUser } from "react-icons/fi";

const Navbar: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(typeof error === 'string' ? error : (error instanceof Error ? error.message : 'Unknown error'));
      }
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openDialog } = useAuth();
  // Refetch authUser after login/signup/logout
  const handleAuthRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
  };
  const { logout } = useAuthMutation();

  // Show toast after logout promise resolves
  const handleLogout = async () => {
    try {
      await logout();
      handleAuthRefetch();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-deepblue">
            <img src="/logo.png" alt="NYXedu Logo" className="h-8 w-8" />
            <h2 className="text-2xl font-bold">NYXedu</h2>
          </Link>
          {/* Removed Subjects link for desktop */}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <input
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gold transition-colors text-sm"
              placeholder="Search..."
              type="search"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : authUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  onClick={() => setDropdownOpen((open) => !open)}
                  type="button"
                  aria-label="Profile"
                >
                  <FiUser size={28} className="text-deepblue" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 z-50">
                    <ProfileDropdown onLogout={handleLogout} email={authUser?.email} />
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="button_primary cursor-pointer"
                  type="button"
                  onClick={() => openDialog('signup')}
                >
                  Sign Up
                </button>
                <button
                  className="text-deepblue bg-gold rounded-2xl py-2 hover:opacity-80 transition-all duration-200 font-semibold px-4 focus:outline-none cursor-pointer"
                  onClick={() => openDialog('signin')}
                  type="button"
                >
                  Log In
                </button>
              </>
            )}
          </div>
          <button className="md:hidden text-deepblue" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Removed Subjects link for mobile */}
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : authUser ? (
              <div className="mt-2">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition w-full"
                  onClick={() => setDropdownOpen((open) => !open)}
                  type="button"
                  aria-label="Profile"
                >
                  <FiUser size={28} className="text-deepblue" />
                </button>
                {dropdownOpen && (
                  <div className="relative mt-2 z-50">
                    <ProfileDropdown onLogout={handleLogout} email={authUser?.email} />
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="button_primary block mt-2"
                  type="button"
                  onClick={() => openDialog('signup')}
                >
                  Sign Up
                </button>
                <button
                  className="text-deepblue hover:text-gold font-semibold px-3 py-2 block w-full text-left focus:outline-none"
                  onClick={() => openDialog('signin')}
                  type="button"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      )}
        <AuthDialog />
      </header>
    );
  }

export default Navbar;

