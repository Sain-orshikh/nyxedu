'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { notes as allNotes } from '../../../data/notes';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';
import { useState } from 'react';

interface Note {
  title: string;
  content: string;
  author: string;
  date: string;
  pdf?: string;
}

const recommendedNotes = [
  {
    title: 'Thermodynamics Notes',
    author: 'Ethan Harper',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo6rH-8RHcfNKoydwxNK9aL86o6d1kp-jDnu-hn69zbA0uy4EnoRHN5Rk9gFNg4XtX9UIyEGUcYxTIIT_AZYJC2Hppq3gD0AMm5K4ul0pRaz2SbTmydbExyDP6YyJFJzN30rF-MK0n_skEc8uYPxgCbtOiGEea16oWXjc2MOOT2-pfJiI-b0PBhTdu_WS_D43cGnFlpqyP9Mr03tPr1JVNzhKtQ7WwZbXnj8sKQbODFAsheHYkckQKdFQ9U9Zi6x4G46hyQGbjF_j8',
  },
  {
    title: 'Electromagnetism Notes',
    author: 'Olivia Bennett',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZymBu-sUi1S2lPSEVPlEWUSfHO3B5l0Dde7j_5sBacSakFNdCu0TcBf8lnKP7AFF6nzC4sbMWwxPbR456EvWWeOjYLcXy5u9PvyystPIemMqGbCL6IH-3UxYPri5Q_X7BMDkd3C6_3ipv7c_wL6ey6Hubd5rnRCx3kRi2nWTuwmSmka3Du1GtNAPIVtTxcWo9bpSTrrj-_6YDdUl5-z-W90_n15_X18g71EW86_ot2Tp9HGOJRLofDytBMo2Xe267YY-67-CmF8i4',
  },
  {
    title: 'Quantum Mechanics Notes',
    author: 'Noah Thompson',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdFz2QDzcfB0cSPJrbdo8jAm8YhpJsPfYp9wctnsOPOOx70yoa61Ru3Idbt-KuYaAfTFIy5fYC_9rnE50ew0SaVEvjDYBMn4Sm7qOXOw8gfYRiL35rcyALvxMhRPJw5EMbrTG1s-Dhxi_f2JQYlLzmk8mmU7VDT8yq7zctcmzR7sE6EjFNORCiY4iLp3Iq2TGdz35bpistTum7oT-NpKm289tooj06Lz8UJrR__SOOnDRoMHTefGfO0Y02-bxEi3F8AnCPv8c_guto',
  },
];

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
  const pdfUrl = noteObj?.pdf || '';

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
  };

  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <main className="flex flex-1 gap-8 p-8 bg-[#fcfaf2] min-h-screen">
      <div className="flex-1 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <div className="mb-2">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/subjects" className="hover:text-[var(--brand-yellow)] text-[var(--brand-blue)] text-sm font-medium">Subjects</Link>
            <Link color="inherit" href={`/${subjectParam}`} className="hover:text-[var(--brand-yellow)] text-[var(--brand-blue)] text-sm font-medium">{subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)}</Link>
            <span className="font-semibold text-[var(--text-primary)] text-sm">{noteObj?.title || noteParam}</span>
          </Breadcrumbs>
        </div>
        {/* Note Title & Author */}
        <h2 className="typography_h1">{noteObj?.title || noteParam}</h2>
        <p className="typography_body mb-2">Uploaded by {noteObj?.author || 'Unknown'} · {noteObj?.date || ''}</p>
        {/* PDF Viewer */}
        <div className="pdf_viewer flex-grow flex items-center justify-center">
          {pdfUrl ? (
            <div style={{ height: '80vh', overflowY: 'scroll', width: '100%' }}>
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div className="text-center text-gray-500">Loading PDF...</div>}
                error={<div className="text-center text-red-500">Failed to load PDF.</div>}
              >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={800}
                  />
                ))}
              </Document>
            </div>
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
              {pdfUrl && (
                <a
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  href={pdfUrl}
                  download
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[var(--brand-blue)]">download</span>
                    <span className="font-medium">Download</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </a>
              )}
              {pdfUrl && (
                <button
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={handlePrint}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[var(--brand-blue)]">print</span>
                    <span className="font-medium">Print</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </button>
              )}
              {pdfUrl && (
                <button
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.style.zoom = '1.2';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[var(--brand-blue)]">zoom_in</span>
                    <span className="font-medium">Zoom</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </button>
              )}
            </div>
          </div>
          <div>
            <h3 className="typography_h2 mb-4">Related Notes</h3>
            <div className="space-y-4">
              {recommendedNotes.map((note, idx) => (
                <a key={idx} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition-colors" href="#">
                  <img alt={note.title + ' Thumbnail'} className="size-16 rounded-md object-cover" src={note.img} />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{note.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">by {note.author}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
