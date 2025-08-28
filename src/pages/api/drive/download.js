import { google } from 'googleapis';

// Initialize Google Drive API
const initializeDrive = () => {
  try {
    // Parse the service account JSON from environment variable
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Drive API:', error);
    throw new Error('Google Drive API initialization failed');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).json({ message: 'File ID is required' });
  }

  try {
    const drive = initializeDrive();

    // Check if client closed connection
    if (req.aborted) {
      return;
    }

    // Get file metadata first to check if it exists and is accessible
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id,name,mimeType,size',
    });

    // Check if it's a PDF
    if (fileMetadata.data.mimeType !== 'application/pdf') {
      return res.status(400).json({ message: 'File is not a PDF' });
    }

    // Check if client closed connection before downloading
    if (req.aborted) {
      return;
    }

    // Get the file content
    const fileContent = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    }, {
      responseType: 'arraybuffer',
    });

    // Final check if client closed connection
    if (req.aborted) {
      return;
    }

    // Set appropriate headers for caching
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileMetadata.data.name}"`);
    res.setHeader('Content-Length', fileMetadata.data.size || fileContent.data.byteLength);
    
    // Enhanced caching headers
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400'); // 7 days cache, 1 day stale
    res.setHeader('ETag', `"${fileId}-${fileMetadata.data.size}"`);
    res.setHeader('Last-Modified', new Date().toUTCString());
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-None-Match, If-Modified-Since');
    res.setHeader('Access-Control-Expose-Headers', 'ETag, Last-Modified, Content-Length');
    
    // Handle conditional requests for caching
    const ifNoneMatch = req.headers['if-none-match'];
    const etag = `"${fileId}-${fileMetadata.data.size}"`;
    
    if (ifNoneMatch === etag) {
      return res.status(304).end(); // Not Modified
    }

    // Send the PDF content
    res.status(200).send(Buffer.from(fileContent.data));

  } catch (error) {
    // Don't send error if client already disconnected
    if (req.aborted) {
      return;
    }

    console.error('Error downloading file from Google Drive:', error);
    
    if (error.code === 404) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    if (error.code === 403) {
      return res.status(403).json({ message: 'Access denied. Check service account permissions.' });
    }

    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
