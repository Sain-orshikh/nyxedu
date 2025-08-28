import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';
import { useState, useEffect } from 'react';
import { createProxyUrl } from '../../utils/pdfUtils';

interface PDFViewerProps {
  file: string;
  width?: number;
  showControls?: boolean;
}

export default function PDFViewer({ file, width = 800, showControls = false }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    const processedUrl = createProxyUrl(file);
    setPdfUrl(processedUrl);
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setLoading(false);
    setError('Failed to load PDF. Please check if the file is accessible.');
    console.error('PDF load error:', error);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages || 1, prev + 1));
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      {/* Controls - only show if showControls is true */}
      {showControls && numPages && (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center">
        {loading && (
          <div className="text-center text-gray-500 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading PDF...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 p-8">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg mb-2">Unable to load PDF</p>
            <p className="text-sm text-gray-600">Please try downloading the file instead</p>
          </div>
        )}

        {pdfUrl && !error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
              cMapPacked: true,
            }}
          >
            {!showControls && numPages ? (
              // Show all pages when controls are hidden
              <div className="space-y-4 p-4">
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="flex justify-center shadow-lg">
                    <Page
                      pageNumber={index + 1}
                      width={Math.min(width, 800)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="border border-gray-300 bg-white"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Show single page when controls are enabled
              numPages && (
                <div className="flex justify-center p-4">
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(width, 800)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="border border-gray-300 bg-white shadow-lg"
                  />
                </div>
              )
            )}
          </Document>
        )}
      </div>
    </div>
  );
}
