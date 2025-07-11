import React from 'react';

// Demo: Replace with backend fetch for user's bookmarks
const bookmarkedNotes = [
  {
    title: 'Algebraic Expressions',
    content: 'A detailed explanation of algebraic expressions, including simplification, expansion, and factorization techniques.',
    author: 'Emily Carter',
    date: 'Sep 15, 2023',
  },
  {
    title: 'Geometry Theorems',
    content: 'Comprehensive notes on key geometry theorems, with proofs and examples for better understanding.',
    author: 'David Lee',
    date: 'Sep 10, 2023',
  },
  {
    title: 'Calculus Basics',
    content: 'An introduction to calculus, covering differentiation and integration with practical applications.',
    author: 'Sophia Clark',
    date: 'Sep 5, 2023',
  },
];

export default function BookmarksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header is global via layout.tsx */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-[#000033]">Bookmarked Notes</h1>
            <p className="text-base text-[#555566] mt-4">
              Here are your bookmarked study notes. You can review, search, and manage your favorite resources in one place.
            </p>
          </div>
        </div>
        <div className="mt-8 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg aria-hidden="true" className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" fillRule="evenodd"></path>
              </svg>
            </div>
            <input className="form-input block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#ffd700] focus:border-[#ffd700] sm:text-sm" placeholder="Search notes..." type="search" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedNotes.map((note, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-[#f0f0f0] hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2 text-[#000033]">{note.title}</h3>
              <p className="text-[#555566] text-sm mb-4">{note.content}</p>
              <div className="flex items-center text-xs text-[#555566]">
                <span>By {note.author}</span>
                <span className="mx-2">•</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Footer is global via layout.tsx */}
    </div>
  );
}
