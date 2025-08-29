'use client';

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Select, MenuItem, InputLabel, FormControl, Breadcrumbs, Link, Typography } from '@mui/material';
import NoteBookmarkIcon from '../../components/common/NoteBookmarkIcon';
import { useParams } from 'next/navigation';
import { driveNotes } from '../../data/driveNotes';
import { teamMembers } from '../../data/teamMembers';
import { searchData } from '../../data/searchData';

interface Note {
  id?: string;
  title: string;
  content: string;
  author: string;
  date: string;
  pdf?: string;
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
  
  // Get notes directly from driveNotes for this subject
  const subjectNotes: Note[] = useMemo(() => {
    return driveNotes
      .filter(note => note.subject === subjectKey)
      .map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        author: note.author,
        date: note.date,
        pdf: note.driveLink
      }));
  }, [subjectKey]);
  const subjectDisplay = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);

  // Fuse.js search functionality - filter searchData by current subject
  const subjectSearchData = useMemo(() => {
    return searchData.filter(item =>
      item.category?.toLowerCase() === subjectKey.toLowerCase()
    );
  }, [subjectKey]);

  // Custom search state and logic for subject-specific search
  const [query, setQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form control states
  const [selectedTopic, setSelectedTopic] = useState('Topic');
  const [selectedAuthor, setSelectedAuthor] = useState('Author');
  const [selectedSort, setSelectedSort] = useState('Sort by Date');

  const fuse = useMemo(() => {
    return new Fuse(subjectSearchData, {
      keys: [
        { name: 'description', weight: 0.7 },
        { name: 'title', weight: 0.2 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.6, // Lower threshold for better matching, especially for short queries
      includeScore: true,
      shouldSort: true,
    });
  }, [subjectSearchData]);

  // Perform search when query changes
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    try {
      const results = fuse.search(query.trim());
      return results.map(result => result.item);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [query, fuse]);

  // Get unique topics from subject notes (using titles)
  const availableTopics = useMemo(() => {
    const topics = subjectNotes.map(note => note.title);
    return [...new Set(topics)]; // Remove duplicates
  }, [subjectNotes]);

  // Ensure selectedTopic is always valid
  const validSelectedTopic = useMemo(() => {
    if (selectedTopic === 'Topic') return 'Topic';
    if (availableTopics.includes(selectedTopic)) return selectedTopic;
    return 'Topic'; // Reset to default if current selection is no longer valid
  }, [selectedTopic, availableTopics]);

  // Update document title with subject information
  useEffect(() => {
    const subjectNotes = searchData.filter(item => item.category?.toLowerCase() === subjectKey.toLowerCase());
    const subjectDisplayName = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);
    
    if (subjectNotes.length > 0) {
      // Use the first note's description to create a meaningful title
      const firstNote = subjectNotes[0];
      const shortDesc = firstNote.description?.substring(0, 60) + (firstNote.description && firstNote.description.length > 60 ? '...' : '');
      document.title = `${subjectDisplayName} Notes - ${shortDesc} | NYXedu`;
    } else {
      document.title = `${subjectDisplayName} Study Materials | NYXedu`;
    }
  }, [subjectKey]);

  // Filter notes based on search results and form controls
  const filteredNotes = useMemo(() => {
    let notesToFilter: Note[];

    // Start with search results or all notes
    if (!query.trim()) {
      notesToFilter = subjectNotes;
    } else if (searchResults.length === 0) {
      return [];
    } else {
      // Map search results back to our note format
      notesToFilter = searchResults.map(result => {
        const note = subjectNotes.find(n =>
          n.title.toLowerCase() === result.title.toLowerCase()
        );
        if (note) {
          return note;
        }

        // If no matching note found, create one from search result
        return {
          id: result.id,
          title: result.title,
          content: result.description || 'No description available',
          author: 'Unknown',
          date: 'Unknown',
          pdf: undefined
        };
      });
    }

    // Apply topic filter
    if (validSelectedTopic !== 'Topic') {
      notesToFilter = notesToFilter.filter(note =>
        note.title === validSelectedTopic
      );
    }

    // Apply author filter
    if (selectedAuthor !== 'Author') {
      notesToFilter = notesToFilter.filter(note =>
        note.author === selectedAuthor
      );
    }

    // Apply sorting
    if (selectedSort === 'Newest First') {
      notesToFilter = [...notesToFilter].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        // Handle invalid dates
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA; // Newest first
      });
    } else if (selectedSort === 'Oldest First') {
      notesToFilter = [...notesToFilter].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        // Handle invalid dates
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateA - dateB; // Oldest first
      });
    }

    return notesToFilter;
  }, [subjectNotes, searchResults, query, validSelectedTopic, selectedAuthor, selectedSort]);

  const handleSearch = useCallback((searchQuery: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      return;
    }

    // Debounce the search to prevent excessive operations
    searchTimeoutRef.current = setTimeout(() => {
      // Search completed
    }, 150);
  }, []);

  // Import teamMembers and filter out the Web Developer
  const authors = teamMembers.filter((member: { name: string; role: string }) => member.role !== 'Web Developer');

  return (
    <div className="min-h-screen flex flex-col pt-16 sm:pt-24 bg-gray-50">
      {/* Header is global via layout.tsx */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-4 bg-gray-50">
        <div className="py-8">
          <div className="max-w-3xl">
            <Breadcrumbs aria-label="breadcrumb" className="mb-4">
              <Link color="inherit" href="/subjects" style={{ fontWeight: 500}}>
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
            <input className="form-input block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-1 focus:placeholder-gray-400 sm:text-sm" placeholder="Search notes..." type="search" value={query} onChange={(e) => handleSearch(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 gap-y-4 w-full sm:flex-row sm:w-auto">
            <FormControl size="small" sx={{ minWidth: 120, backgroundColor: 'white' }}>
              <InputLabel id="topic-select-label">Topic</InputLabel>
              <Select
                key={`topic-${availableTopics.length}`} // Force re-mount when topics change
                labelId="topic-select-label"
                label="Topic"
                value={validSelectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <MenuItem value="Topic">Topic</MenuItem>
                {availableTopics.map((topic) => (
                  <MenuItem key={topic} value={topic}>{topic}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120, backgroundColor: 'white' }}>
              <InputLabel id="author-select-label">Author</InputLabel>
              <Select
                labelId="author-select-label"
                label="Author"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
              >
                <MenuItem value="Author">Author</MenuItem>
                {authors.map((author) => (
                  <MenuItem key={author.name} value={author.name}>{author.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140, backgroundColor: 'white' }}>
              <InputLabel id="sort-select-label">Sort by Date</InputLabel>
              <Select
                labelId="sort-select-label"
                label="Sort by Date"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <MenuItem value="Sort by Date">Sort by Date</MenuItem>
                <MenuItem value="Newest First">Newest First</MenuItem>
                <MenuItem value="Oldest First">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length === 0 && query.trim() ? (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {query.trim() && (selectedTopic !== 'Topic' || selectedAuthor !== 'Author')
                    ? `No notes match your search "${query}" with the selected filters.`
                    : query.trim()
                    ? `No notes in ${subjectDisplay} contain "${query}" in their description.`
                    : `No notes match your selected filters.`
                  }
                </p>
                <div className="mt-6 flex gap-2 justify-center">
                  {query.trim() && (
                    <button
                      onClick={() => handleSearch('')}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Clear search
                    </button>
                  )}
                  {(selectedTopic !== 'Topic' || selectedAuthor !== 'Author' || selectedSort !== 'Sort by Date') && (
                    <button
                      onClick={() => {
                        setSelectedTopic('Topic');
                        setSelectedAuthor('Author');
                        setSelectedSort('Sort by Date');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : filteredNotes.length === 0 && !query.trim() ? (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Search for notes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter keywords to find notes in {subjectDisplay} that contain those terms in their description.
                </p>
              </div>
            </div>
          ) : (
            filteredNotes.map((note, idx) => {
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
                    <h3 className="text-xl font-semibold text-[#000033] pr-8">{note.title}</h3>
                    {note.id && (
                      <span
                        className="absolute top-0 right-0 z-10"
                        onClick={e => e.stopPropagation()}
                      >
                        <NoteBookmarkIcon noteId={note.id} />
                      </span>
                    )}
                  </div>
                  <p className="text-[#555566] text-sm mb-4 pr-8 leading-relaxed">{note.content}</p>
                  <div className="flex items-center text-xs text-[#555566]">
                    <span>By {note.author}</span>
                    <span className="mx-2">•</span>
                    <span>{note.date}</span>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </main>
      {/* Footer is global via layout.tsx */}
    </div>
  );
}
