"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import AuthDialog from '@/components/auth/AuthDialog';
import { useAuth } from '@/context/AuthContext';
import { useAuth as useAuthMutation } from '@/hooks/useAuth';
import ProfileDropdown from '@/components/ProfileDropdown';
import BookmarksDialog from '@/components/common/BookmarksDialog';
import SubjectsDialog from '@/components/common/SubjectsDialog';
import { useSearch } from '@/hooks/useSearch';
import { SearchItem } from '@/data/searchData';
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
  const [openBookmarks, setOpenBookmarks] = useState(false);
  const [openSubjects, setOpenSubjects] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { openDialog } = useAuth();
  const { query, results, isSearching, search, clearSearch, hasResults } = useSearch();
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
    } catch {
      toast.error('Logout failed');
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    search(value);
    setShowSearchResults(value.length > 0);
  };

  // Handle search result click
  const handleSearchResultClick = (result: SearchItem) => {
    setShowSearchResults(false);
    clearSearch();
    // Navigate to the result URL if it exists
    if (result.url) {
      window.location.href = result.url;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    if (dropdownOpen || showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, showSearchResults]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-8 pl-6">
          <Link href="/" className="flex items-center gap-3 text-deepblue">
            <Image src="/logo.png" alt="NYXedu Logo" width={32} height={32} className="h-8 w-8" />
            <h2 className="text-2xl font-bold">NYXedu</h2>
          </Link>
          {/* Removed Subjects link for desktop */}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative" ref={searchRef}>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-1 transition-colors text-sm"
              placeholder="Search subjects, notes..."
              type="search"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => query && setShowSearchResults(true)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                ) : hasResults ? (
                  <div className="py-2">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {result.type === 'subject' ? (
                              <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {result.category} • {result.type}
                            </div>
                            {result.description && (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {result.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 ml-3">
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
                    <ProfileDropdown
                      onLogout={handleLogout}
                      email={authUser?.email}
                      onOpenBookmarks={() => setOpenBookmarks(true)}
                      onOpenSubjects={() => setOpenSubjects(true)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="button_primary cursor-pointer hover:opacity-60 transition-all duration-200 text-deepblue font-semibold mr-2"
                  type="button"
                  onClick={() => openDialog('signup')}
                >
                  Sign Up
                </button>
                <button
                  className="text-deepblue bg-green-400/80 rounded-2xl py-2 hover:opacity-80 transition-all duration-200 font-semibold px-4 focus:outline-none cursor-pointer"
                  onClick={() => openDialog('signin')}
                  type="button"
                >
                  Log In
                </button>
              </>
            )}
          </div>
          <button className="md:hidden text-deepblue pr-6" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 pt-6 pb-6 space-y-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="w-full" ref={searchRef}>
              <div className="relative">
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm bg-gray-50"
                  placeholder="Search subjects, notes..."
                  type="search"
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={() => query && setShowSearchResults(true)}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {showSearchResults && (
                <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : hasResults ? (
                    <div className="py-2">
                      {results.slice(0, 5).map((result) => (
                        <button
                          key={result.id}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                          onClick={() => handleSearchResultClick(result)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg bg-gray-100">
                              {result.type === 'subject' ? (
                                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {result.category} • {result.type}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center">
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Authentication Section */}
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
              </div>
            ) : authUser ? (
              <div className="space-y-4">
                <div className="text-center py-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Welcome back!</p>
                  <p className="text-sm font-medium text-gray-900">{authUser.email}</p>
                </div>
                <ProfileDropdown
                  onLogout={handleLogout}
                  email={authUser?.email}
                  onOpenBookmarks={() => setOpenBookmarks(true)}
                  onOpenSubjects={() => setOpenSubjects(true)}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  type="button"
                  onClick={() => {
                    openDialog('signin');
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Log In
                  </div>
                </button>
                <button
                  className="w-full py-3 px-4 rounded-xl font-semibold text-green-600 bg-white border-2 border-green-400 hover:bg-green-50 transition-all duration-200"
                  type="button"
                  onClick={() => {
                    openDialog('signup');
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
        <BookmarksDialog open={openBookmarks} onClose={() => setOpenBookmarks(false)} />
        <SubjectsDialog open={openSubjects} onClose={() => setOpenSubjects(false)} />
        <AuthDialog />
      </header>
    );
  }

export default Navbar;

