'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-deepblue">
            <img src="/logo.png" alt="NYXedu Logo" className="h-8 w-8" />
            <h2 className="text-2xl font-bold">NYXedu</h2>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-lg">
            <Link className="text-deepblue hover:text-gold transition-colors" href="/subjects">
              Subjects
            </Link>
            <Link className="text-deepblue hover:text-gold transition-colors" href="/bookmarks">
              Bookmarks
            </Link>
            <Link className="text-deepblue hover:text-gold transition-colors" href="/contact-us">
              Contact
            </Link>
          </div>
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
            <Link className="button_primary" href="#">
              Sign Up
            </Link>
            <Link className="text-deepblue hover:text-gold font-semibold px-4" href="#">
              Log In
            </Link>
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
            <Link
              className="text-deepblue hover:text-gold block px-3 py-2 rounded-md text-base font-medium"
              href="/subjects"
            >
              Subjects
            </Link>
            <Link
              className="text-deepblue hover:text-gold block px-3 py-2 rounded-md text-base font-medium"
              href="/bookmarks"
            >
              Bookmarks
            </Link>
            <Link
              className="text-deepblue hover:text-gold block px-3 py-2 rounded-md text-base font-medium"
              href="/contact-us"
            >
              Contact
            </Link>
            <Link className="button_primary block mt-2" href="#">
              Sign Up
            </Link>
            <Link
              className="text-deepblue hover:text-gold font-semibold px-3 py-2 block"
              href="#"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
