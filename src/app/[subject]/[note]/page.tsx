'use client';

import React, { useEffect } from 'react';
import NoteBookmarkIcon from '../../../components/common/NoteBookmarkIcon';
import { useParams } from 'next/navigation';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import { driveNotes } from '../../../data/driveNotes';
import { extractGoogleDriveFileId } from '../../../utils/pdfUtils';
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('../../../components/common/PDFViewer'), { ssr: false });

interface Note {
  title: string;
  content: string;
  author: string;
  date: string;
  pdf?: string;
}

export default function NotePage() {
  const params = useParams();
  let subjectParam = 'biology';
  let noteParam = '';
  if (params?.subject) {
    subjectParam = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  }
  if (params?.note) {
    noteParam = Array.isArray(params.note) ? params.note[0] : params.note;
  }

  // Get driveNote for current note
  const driveNote = driveNotes.find(n => n.id === noteParam);

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

  const subjectKey = codeToSubject[subjectParam] || (typeof subjectParam === 'string' ? subjectParam.toLowerCase() : '');
  
  // Get notes directly from driveNotes for this subject
  const subjectNotes: Note[] = driveNotes
    .filter(note => note.subject === subjectKey)
    .map(note => ({
      title: note.title,
      content: note.content,
      author: note.author,
      date: note.date,
      pdf: note.driveLink
    }));
  
  const noteObj = subjectNotes.find((n: Note) => 
    typeof n.title === 'string' && 
    typeof noteParam === 'string' && 
    n.title.toLowerCase().includes(noteParam.toLowerCase())
  );

  // Try to get drive note by id (noteParam)
  // driveNote already declared above
  const pdfUrl = driveNote?.driveLink || noteObj?.pdf || '';

  // handlePrint removed (unused)

  // Update document title with note information
  useEffect(() => {
    const currentNote = driveNote || noteObj;
    const subjectDisplayName = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);
    
    if (currentNote) {
      // Create a meaningful title using note title and subject
      const noteTitle = currentNote.title;
      const shortDesc = currentNote.content?.substring(0, 50) +
        (currentNote.content && currentNote.content.length > 50 ? '...' : '');
      document.title = `${noteTitle} - ${shortDesc} | NYXedu`;
    } else {
      document.title = `${noteParam} - ${subjectDisplayName} | NYXedu`;
    }
  }, [driveNote, noteObj, subjectKey, noteParam]);

  return (
    <main className="pt-16 sm:pt-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs Navigation */}
        <div className="mb-6">
          <Breadcrumbs aria-label="breadcrumb" className="mb-4">
            <Link color="inherit" href="/subjects" style={{ fontWeight: 500, textDecoration: 'underline' }}>
              Subjects
            </Link>
            <Link color="inherit" href={`/${subjectParam}`} style={{ fontWeight: 500, textDecoration: 'underline' }}>
              {subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)}
            </Link>
            <Typography color="text.primary" style={{ fontWeight: 600 }}>
              {driveNote?.title || noteObj?.title || noteParam}
            </Typography>
          </Breadcrumbs>
        </div>

        {/* Note Header Section */}
        <div className=" border-gray-300 mb-4 border-t pt-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left side - Title and Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-400">
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    {driveNote?.title || noteObj?.title || noteParam}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Exam Code: {subjectParam}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      By {driveNote?.author || noteObj?.author || 'Unknown'}
                    </span>
                    {driveNote?.date && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {driveNote.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Action Buttons */}
            {pdfUrl && driveNote && (
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 h-11 px-6 text-sm font-medium rounded-lg bg-green-400/90 hover:bg-green-500/80 transition-all duration-200 cursor-pointer text-white shadow-sm"
                  onClick={() => {
                    const fileId = extractGoogleDriveFileId(driveNote.driveLink);
                    if (fileId) {
                      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                      const a = document.createElement('a');
                      a.href = downloadUrl;
                      a.download = driveNote.title + '.pdf';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    } else {
                      window.open(driveNote.driveLink, '_blank');
                    }
                  }}
                >
                  <svg className="feather feather-download" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  <span>Download</span>
                </button>
                <div className="flex items-center justify-center cursor-pointer">
                  <NoteBookmarkIcon noteId={driveNote.id} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* PDF Section */}
          <div className="flex flex-col h-full">
            <div className="rounded-2xl flex-1 flex flex-col">
              {/* PDF Viewer */}
              <div className="flex justify-center">
                {pdfUrl ? (
                  <div className="w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                    <PDFViewer 
                      file={pdfUrl} 
                      showControls={false} 
                    />
                  </div>
                ) : (
                  <span className="text-gray-500">No PDF available for this note.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
