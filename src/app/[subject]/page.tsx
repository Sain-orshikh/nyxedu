'use client';

import React, { useState } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Breadcrumbs, Link, Typography } from '@mui/material';
import NoteBookmarkIcon from '../../components/common/NoteBookmarkIcon';
import { useParams } from 'next/navigation';
import { notes as allNotes } from '../../data/notes';
import { useAuthUser } from '../../hooks/useAuthUser';

interface Note {
  id?: string;
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
  const { data: authUser } = useAuthUser();
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
  // Try to match notes with driveNotes for id
  const { driveNotes } = require('../../data/driveNotes');
  const rawNotes: Note[] = (allNotes as NotesBySubject)[subjectKey] || [];
  const subjectNotes: Note[] = rawNotes.map(note => {
    // Try to find a driveNote with matching title and subject
    const match = driveNotes.find((dn: any) => dn.title === note.title && dn.subject === subjectKey);
    return match ? { ...note, id: match.id } : note;
  });
  const subjectDisplay = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);

  // Import teamMembers and filter out the Web Developer
  const { teamMembers } = require('../../data/teamMembers');
  const authors = teamMembers.filter((member: any) => member.role !== 'Web Developer');

  return (
    <div className="min-h-screen flex flex-col pt-16 sm:pt-24 bg-gray-50">
      {/* Header is global via layout.tsx */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-4 bg-gray-50">
        <div className="py-8">
          <div className="max-w-3xl">
            <Breadcrumbs aria-label="breadcrumb" className="mb-4">
              <Link color="inherit" href="/subjects" style={{ fontWeight: 500 }}>
                Subjects
              </Link>
              <Typography color="text.primary" style={{ fontWeight: 600 }}>{subjectDisplay}</Typography>
            </Breadcrumbs>
            <div className="flex items-center gap-4 mt-4">
              <h1 className="text-4xl font-bold text-[#000033]">{subjectDisplay}</h1>
              <span className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-base font-mono text-[#333]">{code}</span>
            </div>
            <p className="text-base text-[#555566] mt-4">
              Browse notes, filter by topic or author, and find what you need for {subjectDisplay}.
            </p>
          </div>
        </div>
        <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg aria-hidden="true" className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" fillRule="evenodd"></path>
              </svg>
            </div>
            <input className="form-input block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-1 focus:placeholder-gray-400 sm:text-sm" placeholder="Search notes..." type="search" />
          </div>
          <div className="flex flex-col gap-2 gap-y-4 w-full sm:flex-row sm:w-auto">
            <FormControl size="small" sx={{ minWidth: 120, backgroundColor: 'white' }}>
              <InputLabel id="topic-select-label">Topic</InputLabel>
              <Select labelId="topic-select-label" label="Topic" defaultValue="Topic">
                <MenuItem value="Topic">Topic</MenuItem>
                {/* Add dynamic topic options here if needed */}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120, backgroundColor: 'white' }}>
              <InputLabel id="author-select-label">Author</InputLabel>
              <Select labelId="author-select-label" label="Author" defaultValue="Author">
                <MenuItem value="Author">Author</MenuItem>
                {authors.map((author: any) => (
                  <MenuItem key={author.name} value={author.name}>{author.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140, backgroundColor: 'white' }}>
              <InputLabel id="sort-select-label">Sort by Date</InputLabel>
              <Select labelId="sort-select-label" label="Sort by Date" defaultValue="Sort by Date">
                <MenuItem value="Sort by Date">Sort by Date</MenuItem>
                <MenuItem value="Newest First">Newest First</MenuItem>
                <MenuItem value="Oldest First">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectNotes.map((note, idx) => {
            const noteLink = note.id
              ? `/${code}/${note.id}`
              : `/${code}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`;
            return (
              <a
                key={idx}
                href={noteLink}
                className={`bg-white rounded-xl p-6 border border-gray-200 block shadow-md transition-shadow duration-300 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2 relative">
                  <h3 className="text-xl font-semibold text-[#000033]">{note.title}</h3>
                  {note.id && (
                    <span
                      className="absolute top-0 right-0 z-10"
                      onClick={e => e.stopPropagation()}
                    >
                      <NoteBookmarkIcon noteId={note.id} />
                    </span>
                  )}
                </div>
                <p className="text-[#555566] text-sm mb-4">{note.content}</p>
                <div className="flex items-center text-xs text-[#555566]">
                  <span>By {note.author}</span>
                  <span className="mx-2">•</span>
                  <span>{note.date}</span>
                </div>
              </a>
            );
          })}
        </div>
      </main>
      {/* Footer is global via layout.tsx */}
    </div>
  );
}
