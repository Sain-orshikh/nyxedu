'use client';

import React from 'react';
import Image from 'next/image';
import NoteBookmarkIcon from '../../../components/common/NoteBookmarkIcon';
import { useParams } from 'next/navigation';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import { notes as allNotes } from '../../../data/notes';
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

// ...existing code...
import { getRecommendedNotes } from '../../../data/getRecommendedNotes';

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
  // For recommended notes
  const recommendedNotes = driveNote
    ? getRecommendedNotes(driveNote.id, driveNote.subject, driveNote.chapter)
    : [];

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
  const subjectNotes: Note[] = (allNotes as Record<string, Note[]>)[subjectKey] || [];
  const noteObj = subjectNotes.find((n: Note) => typeof n.title === 'string' && typeof noteParam === 'string' && n.title.toLowerCase().includes(noteParam.toLowerCase()));

  // Try to get drive note by id (noteParam)
  // driveNote already declared above
  const pdfUrl = driveNote?.driveLink || noteObj?.pdf || '';

  // handlePrint removed (unused)

  return (
    <main className="pt-16 sm:pt-24 min-h-screen" style={{ backgroundColor: '#eafaf1' }}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PDF Section */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className=" rounded-2xl px-0 sm:px-16 flex-1 flex flex-col" style={{ backgroundColor: '#eafaf1' }}>
              {/* PDF Viewer */}
              <div className="flex-1 bg-gray-200 rounded-xl flex items-center justify-center border-4 border-gray-300">
                {pdfUrl ? (
                  <PDFViewer file={pdfUrl} width={800} showControls={false} />
                ) : (
                  <span className="text-gray-500">No PDF available for this note.</span>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500">
                  <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path></svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--text-primary)]">{driveNote?.title || noteObj?.title || noteParam}</h1>
                  <p className="text-sm text-[var(--text-secondary)]">By {driveNote?.author || noteObj?.author || 'Unknown'} • {driveNote?.date || noteObj?.date || ''}</p>
                </div>
              </div>
              <div className="space-y-4">
                {pdfUrl && driveNote && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="flex items-center gap-2 h-11 px-4 text-sm font-medium rounded-lg bg-green-500 hover:bg-green-300 hover:opacity-80 transition-all duration-200 cursor-pointer w-full justify-center text-[var(--text-primary)]"
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
                      <svg className="feather feather-download" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                      <span>Download Notes</span>
                    </button>
                    <span className="hover:opacity-80 transition-all duration-200 cursor-pointer pb-6">
                      <NoteBookmarkIcon noteId={driveNote.id} />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Related Notes</h3>
              <div className="space-y-4">
                {recommendedNotes.length > 0 ? (
                  recommendedNotes.map((note, idx) => {
                    const posterSrc = `/poster/${note.subject}-poster.webp`;
                    return (
                      <a
                        key={idx}
                        className="group flex items-start gap-4"
                        href={`/${note.subjectCode}/${note.id}`}
                      >
                        <div className="w-16 h-20 flex-shrink-0 rounded-md bg-gray-200 overflow-hidden border border-gray-300">
                          <Image
                            src={posterSrc}
                            alt={note.subject + ' poster'}
                            width={64}
                            height={80}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-md font-semibold text-[var(--text-primary)] group-hover:text-green-700 transition-colors">{note.title}</h4>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{note.content}</p>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div className="text-gray-500">No related notes found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
