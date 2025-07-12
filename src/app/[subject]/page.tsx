'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { notes as allNotes } from '../../data/notes';

interface Note {
  title: string;
  content: string;
  author: string;
  date: string;
  pdf?: string;
}

interface NotesBySubject {
  [key: string]: Note[];
}

export default function SubjectPage() {
  const params = useParams();
  let code = '';
  if (params?.subject) {
    code = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  }

  // Map code to subject key
  const codeToSubject: { [key: string]: string } = {
    '0610': 'biology',
    '0606': 'mathematics',
    '0450': 'business',
    '0620': 'chemistry',
    '0478': 'computer science',
    '0455': 'economics',
    '0470': 'history',
    '0417': 'ict',
    '0410': 'music',
    '0625': 'physics',
    // Add more mappings as needed
  };

  const subjectKey = codeToSubject[code] || code.toLowerCase();
  const subjectNotes: Note[] = (allNotes as NotesBySubject)[subjectKey] || [];
  const subjectDisplay = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-white pt-12">
      {/* Header is global via layout.tsx */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-[#000033]">{subjectDisplay}</h1>
            <p className="text-base text-[#555566] mt-4">
              Explore a comprehensive collection of student-contributed study notes for {subjectDisplay}, covering all topics and concepts within the Cambridge IGCSE, AS, and A Level syllabi. Filter and sort notes by topic, author, or date to find the resources that best suit your learning needs.
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
          <div className="flex gap-2">
            <select className="form-select rounded-lg border-gray-300 focus:ring-1 focus:ring-[#ffd700] focus:border-[#ffd700]">
              <option>Topic</option>
            </select>
            <select className="form-select rounded-lg border-gray-300 focus:ring-1 focus:ring-[#ffd700] focus:border-[#ffd700]">
              <option>Author</option>
            </select>
            <select className="form-select rounded-lg border-gray-300 focus:ring-1 focus:ring-[#ffd700] focus:border-[#ffd700]">
              <option>Sort by Date</option>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectNotes.map((note, idx) => (
            <a
              key={idx}
              href={`/${code}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`}
              className="bg-white rounded-xl p-6 border border-[#f0f0f0] hover:border-gold hover:shadow-lg transition-shadow duration-300 block"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#000033]">{note.title}</h3>
              <p className="text-[#555566] text-sm mb-4">{note.content}</p>
              <div className="flex items-center text-xs text-[#555566]">
                <span>By {note.author}</span>
                <span className="mx-2">•</span>
                <span>{note.date}</span>
              </div>
            </a>
          ))}
        </div>
      </main>
      {/* Footer is global via layout.tsx */}
    </div>
  );
}
