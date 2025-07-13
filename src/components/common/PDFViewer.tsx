import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';
import { useState } from 'react';

interface PDFViewerProps {
  file: string;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <div style={{ height: '80vh', overflowY: 'scroll', width: '100%' }}>
      <Document
        file={file}
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
  );
}
