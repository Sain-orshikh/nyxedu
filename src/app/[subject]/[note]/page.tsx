'use client';

import React from 'react';
import NoteBookmarkIcon from '../../../components/common/NoteBookmarkIcon';
import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { notes as allNotes } from '../../../data/notes';
import { driveNotes } from '../../../data/driveNotes';
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

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
  };

  return (
    <main className="pt-24 flex flex-1 gap-8 p-8 bg-gray-50 min-h-screen">
      <div className="flex-1 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <div className="mb-2">
          <Breadcrumbs aria-label="breadcrumb" className="text-base font-semibold mb-2">
            <Link
              color="inherit"
              href="/subjects"
              className="hover:text-[#2a3c4a] text-[#0052CC] px-2 py-1 rounded transition-all duration-200 text-base font-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              Subjects
            </Link>
            <Link
              color="inherit"
              href={`/${subjectParam}`}
              className="hover:text-[#2a3c4a] text-[#0052CC] px-2 py-1 rounded transition-all duration-200 text-base font-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              {subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)}
            </Link>
            <span className="font-semibold text-[#2a3c4a] px-2 py-1 text-base" style={{ fontSize: '1.1rem' }}>{driveNote?.title || noteObj?.title || noteParam}</span>
          </Breadcrumbs>
        </div>
        {/* Note Title & Author */}
        <h2 className="typography_h1">{driveNote?.title || noteObj?.title || noteParam}</h2>
        <p className="typography_body mb-2">Uploaded by {driveNote?.author || noteObj?.author || 'Unknown'} · {driveNote?.date || noteObj?.date || ''}</p>
        {/* PDF Viewer */}
        <div className="pdf_viewer flex-grow flex items-center justify-center">
          {pdfUrl ? (
            driveNote ? (
              <iframe
                id="pdf-iframe"
                src={pdfUrl.replace('/view?usp=drive_link', '/preview')}
                title={driveNote.title}
                style={{ width: '100%', height: '80vh', border: 'none' }}
                allow="autoplay"
              />
            ) : (
              <PDFViewer file={pdfUrl} />
            )
          ) : (
            <div className="text-center text-gray-500">No PDF available for this note.</div>
          )}
        </div>
      </div>
      {/* Sidebar */}
      <aside className="sidebar w-[360px]">
        <div className="space-y-6">
          <div>
            <h3 className="typography_h2 mb-4">Actions</h3>
            <div className="space-y-3">
              {pdfUrl && driveNote && (
                <button
                  className="flex items-center justify-between w-full p-3 rounded-lg border border-[#2563eb] bg-white shadow hover:bg-[#f5faff] transition-colors"
                  onClick={() => {
                    // Try to force download from Google Drive
                    const fileIdMatch = driveNote.driveLink.match(/\/d\/(.*?)\//);
                    const fileId = fileIdMatch ? fileIdMatch[1] : null;
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
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#2563eb]">download</span>
                    <span className="font-medium">Download PDF</span>
                  </div>
                </button>
              )}
              {pdfUrl && driveNote && (
                <NoteBookmarkIcon noteId={driveNote.id} />
              )}
            </div>
          </div>
          <div>
            <h3 className="typography_h2 mb-4">Related Notes</h3>
            <div className="space-y-4">
              {recommendedNotes.length > 0 ? (
                recommendedNotes.map((note, idx) => {
                  const posterSrc = `/poster/${note.subject}-poster.webp`;
                  return (
                    <a
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-300 shadow hover:shadow-lg hover:border-gold transition-colors bg-white"
                      href={`/${note.subjectCode}/${note.id}`}
                    >
                      <img
                        src={posterSrc}
                        alt={note.subject + ' poster'}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{note.title}</p>
                        <p className="text-sm text-[var(--text-secondary)]">by {note.author}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{note.subject.charAt(0).toUpperCase() + note.subject.slice(1)} · Chapter {note.chapter}</p>
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
      </aside>
    </main>
  );
}
