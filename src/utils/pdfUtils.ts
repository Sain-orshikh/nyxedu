/**
 * Utility functions for handling PDF files, especially from Google Drive
 */

/**
 * Convert Google Drive share URLs to direct download URLs
 * @param url - The Google Drive URL
 * @returns Direct download URL
 */
export function convertGoogleDriveUrl(url: string): string {
  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    // Format: https://drive.google.com/file/d/FILE_ID/preview
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (viewMatch) {
      fileId = viewMatch[1];
    }
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }
    
    // If we found a file ID, convert to direct download URL
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  
  // Return original URL if it's not a Google Drive URL or couldn't be converted
  return url;
}

/**
 * Extract file ID from Google Drive URLs
 * @param url - The Google Drive URL
 * @returns File ID or null if not found
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url.includes('drive.google.com')) return null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view or /preview
  const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (viewMatch) return viewMatch[1];
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (openMatch) return openMatch[1];
  
  return null;
}

/**
 * Create a proxy URL for loading PDFs that might have CORS issues
 * @param url - The original PDF URL
 * @returns Proxy URL or original URL
 */
export function createProxyUrl(url: string): string {
  // For Google Drive files, we'll use the direct download URL
  if (url.includes('drive.google.com')) {
    return convertGoogleDriveUrl(url);
  }
  
  // For other URLs that might have CORS issues, you can implement a proxy
  // For now, return the original URL
  return url;
}

/**
 * Check if a URL is a Google Drive URL
 * @param url - The URL to check
 * @returns Boolean indicating if it's a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}
