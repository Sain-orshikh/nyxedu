/**
 * PDF Caching utility using IndexedDB for persistent storage
 * Handles 5-6MB PDFs efficiently with smart cache management
 */

interface CachedPDF {
  fileId: string;
  data: ArrayBuffer;
  timestamp: number;
  size: number;
  filename: string;
}

class PDFCacheManager {
  private dbName = 'NyxEduPDFCache';
  private dbVersion = 1;
  private storeName = 'pdfs';
  private maxCacheSize = 100 * 1024 * 1024; // 100MB max cache
  private maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'fileId' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  async getCachedPDF(fileId: string): Promise<ArrayBuffer | null> {
    try {
      const db = await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(fileId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result as CachedPDF;
          
          if (!result) {
            resolve(null);
            return;
          }

          // Check if cache is expired
          const isExpired = Date.now() - result.timestamp > this.maxAge;
          if (isExpired) {
            this.deleteCachedPDF(fileId); // Clean up expired cache
            resolve(null);
            return;
          }

          console.log(`📄 PDF loaded from cache: ${result.filename} (${(result.size / 1024 / 1024).toFixed(2)}MB)`);
          resolve(result.data);
        };
      });
    } catch (error) {
      console.error('Error retrieving cached PDF:', error);
      return null;
    }
  }

  async cachePDF(fileId: string, data: ArrayBuffer, filename: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      
      // Check cache size and clean up if needed
      await this.cleanupCache();
      
      const cachedPDF: CachedPDF = {
        fileId,
        data,
        timestamp: Date.now(),
        size: data.byteLength,
        filename
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(cachedPDF);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          console.log(`💾 PDF cached: ${filename} (${(data.byteLength / 1024 / 1024).toFixed(2)}MB)`);
          resolve();
        };
      });
    } catch (error) {
      console.error('Error caching PDF:', error);
      // Don't throw error - caching failure shouldn't break functionality
    }
  }

  private async deleteCachedPDF(fileId: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(fileId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Error deleting cached PDF:', error);
    }
  }

  private async cleanupCache(): Promise<void> {
    try {
      const db = await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = async () => {
          const allItems = request.result as CachedPDF[];
          
          // Calculate total cache size
          const totalSize = allItems.reduce((sum, item) => sum + item.size, 0);
          
          if (totalSize > this.maxCacheSize) {
            // Sort by timestamp (oldest first)
            allItems.sort((a, b) => a.timestamp - b.timestamp);
            
            // Remove oldest items until under cache limit
            let currentSize = totalSize;
            for (const item of allItems) {
              if (currentSize <= this.maxCacheSize * 0.8) break; // Keep 20% buffer
              
              await this.deleteCachedPDF(item.fileId);
              currentSize -= item.size;
              console.log(`🗑️ Removed old cached PDF: ${item.filename}`);
            }
          }
          
          resolve();
        };
      });
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }

  async getCacheStats(): Promise<{ count: number; totalSize: number; items: Array<{ fileId: string; filename: string; size: number; age: number }> }> {
    try {
      const db = await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const allItems = request.result as CachedPDF[];
          const now = Date.now();
          
          const stats = {
            count: allItems.length,
            totalSize: allItems.reduce((sum, item) => sum + item.size, 0),
            items: allItems.map(item => ({
              fileId: item.fileId,
              filename: item.filename,
              size: item.size,
              age: now - item.timestamp
            }))
          };
          
          resolve(stats);
        };
      });
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { count: 0, totalSize: 0, items: [] };
    }
  }

  async clearCache(): Promise<void> {
    try {
      const db = await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          console.log('🗑️ PDF cache cleared');
          resolve();
        };
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Create singleton instance
export const pdfCacheManager = new PDFCacheManager();

// Helper function to create blob URL from cached data
export function createBlobUrlFromArrayBuffer(data: ArrayBuffer): string {
  const blob = new Blob([data], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

// Helper function to clean up blob URLs
export function revokeBlobUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
