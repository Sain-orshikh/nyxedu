import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';
import { useState, useEffect, useMemo, useCallback, useRef, Component } from 'react';
import { createProxyUrl, extractGoogleDriveFileId, isGoogleDriveUrl } from '../../utils/pdfUtils';
import { pdfCacheManager, createBlobUrlFromArrayBuffer, revokeBlobUrl } from '../../utils/pdfCache';

// Error boundary for PDF rendering
class PDFErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode; resetKey?: string },
  { hasError: boolean; errorKey?: string }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode; resetKey?: string }) {
    super(props);
    this.state = { hasError: false, errorKey: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('PDF Error Boundary caught an error:', error);
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: { children: React.ReactNode; fallback: React.ReactNode; resetKey?: string },
    state: { hasError: boolean; errorKey?: string }
  ) {
    // Reset error state when resetKey changes
    if (props.resetKey !== state.errorKey && state.hasError) {
      return { hasError: false, errorKey: props.resetKey };
    }
    return { errorKey: props.resetKey };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PDF Error Boundary error details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

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
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentBlobUrlRef = useRef<string>('');

  // Memoize the options object to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
  }), []);

  // Load PDF with caching
  const loadPDF = useCallback(async (fileUrl: string) => {
    console.log('🔄 Loading PDF:', fileUrl);
    setLoading(true);
    setError(null);
    setNumPages(null);
    setPageNumber(1);

    // Clean up previous blob URL
    if (currentBlobUrlRef.current) {
      revokeBlobUrl(currentBlobUrlRef.current);
      currentBlobUrlRef.current = '';
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      const isGoogleDrive = isGoogleDriveUrl(fileUrl);
      
      if (isGoogleDrive) {
        const fileId = extractGoogleDriveFileId(fileUrl);
        console.log('📁 Google Drive file ID:', fileId);
        
        if (fileId) {
          // Try to get from cache first
          const cachedData = await pdfCacheManager.getCachedPDF(fileId);
          
          if (cachedData) {
            // Use cached data
            console.log('🎯 Using cached PDF data');
            const blobUrl = createBlobUrlFromArrayBuffer(cachedData);
            currentBlobUrlRef.current = blobUrl;
            setPdfUrl(blobUrl);
            // Note: loading will be cleared by onDocumentLoadSuccess
            return;
          }
        }
      }

      // If not cached or not Google Drive, fetch from server
      const proxyUrl = createProxyUrl(fileUrl);
      console.log('🌐 Fetching PDF from:', proxyUrl);
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(proxyUrl, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Cache Google Drive PDFs
      if (isGoogleDriveUrl(fileUrl)) {
        const fileId = extractGoogleDriveFileId(fileUrl);
        if (fileId) {
          const filename = response.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] || `pdf-${fileId}.pdf`;
          await pdfCacheManager.cachePDF(fileId, arrayBuffer, filename);
        }
      }

      // Create blob URL for display
      const blobUrl = createBlobUrlFromArrayBuffer(arrayBuffer);
      currentBlobUrlRef.current = blobUrl;
      setPdfUrl(blobUrl);
      console.log('✅ PDF blob URL created, ready for rendering');

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled, don't show error
      }
      console.error('Error loading PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load PDF: ${errorMessage}`);
    }
  }, []);

  useEffect(() => {
    loadPDF(file);

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (currentBlobUrlRef.current) {
        revokeBlobUrl(currentBlobUrlRef.current);
      }
    };
  }, [file, loadPDF]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    // Check if component is still mounted and request wasn't aborted
    if (!abortControllerRef.current?.signal.aborted) {
      // Ensure numPages is a valid positive number
      const validNumPages = typeof numPages === 'number' && numPages > 0 ? numPages : null;
      if (validNumPages) {
        setNumPages(validNumPages);
        setLoading(false);
        setError(null);
        console.log(`📄 PDF loaded successfully: ${validNumPages} pages`);
      } else {
        setError('Invalid PDF: No pages found');
        setLoading(false);
      }
    }
  };

  const onDocumentLoadError = (error: Error) => {
    // Only handle error if component is still mounted and request wasn't aborted
    if (!abortControllerRef.current?.signal.aborted) {
      setLoading(false);
      setError('Failed to load PDF. Please check if the file is accessible.');
      console.error('PDF load error:', error);
    }
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages || 1, prev + 1));
  };

  // Ensure pageNumber is within valid range when numPages changes
  useEffect(() => {
    if (numPages && pageNumber > numPages) {
      setPageNumber(1);
    }
  }, [numPages, pageNumber]);

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
          <PDFErrorBoundary
            resetKey={pdfUrl} // Reset error boundary when PDF URL changes
            fallback={
              <div className="text-center text-red-500 p-8">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-lg mb-2">PDF rendering error</p>
                <p className="text-sm text-gray-600">Please try refreshing the page</p>
              </div>
            }
          >
            <Document
              key={pdfUrl} // Force re-render when URL changes
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              error=""
              options={pdfOptions}
            >
              {!showControls && numPages && numPages > 0 ? (
                // Show all pages when controls are hidden
                <div className="space-y-4 p-4">
                  {Array.from({ length: numPages }, (_, index) => (
                    <div key={`page_${index + 1}`} className="flex justify-center shadow-lg">
                      <Page
                        pageNumber={index + 1}
                        width={Math.min(width, 800)}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="border border-gray-300 bg-white"
                        onLoadError={(error) => {
                          console.warn(`Error loading page ${index + 1}:`, error);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Show single page when controls are enabled
                numPages && numPages > 0 && pageNumber <= numPages && (
                  <div className="flex justify-center p-4">
                    <Page
                      pageNumber={pageNumber}
                      width={Math.min(width, 800)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="border border-gray-300 bg-white shadow-lg"
                      onLoadError={(error) => {
                        console.warn(`Error loading page ${pageNumber}:`, error);
                      }}
                    />
                  </div>
                )
              )}
            </Document>
          </PDFErrorBoundary>
        )}
      </div>
    </div>
  );
}
