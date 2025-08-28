import React, { useState, useEffect } from 'react';
import { pdfCacheManager } from '../../utils/pdfCache';

interface CacheStats {
  count: number;
  totalSize: number;
  items: Array<{
    fileId: string;
    filename: string;
    size: number;
    age: number;
  }>;
}

export default function PDFCacheDebug() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const loadStats = async () => {
    const cacheStats = await pdfCacheManager.getCacheStats();
    setStats(cacheStats);
  };

  const clearCache = async () => {
    await pdfCacheManager.clearCache();
    await loadStats();
  };

  useEffect(() => {
    if (isVisible) {
      loadStats();
    }
  }, [isVisible]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatAge = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded shadow-lg hover:bg-blue-600 text-sm"
        >
          📊 Cache Stats
        </button>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">PDF Cache Stats</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {stats && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Files:</span>
                  <span className="ml-2 font-medium">{stats.count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-medium">{formatSize(stats.totalSize)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={loadStats}
                  className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Refresh
                </button>
                <button
                  onClick={clearCache}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Clear Cache
                </button>
              </div>
              
              {stats.items.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cached Files:</h4>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {stats.items.map((item) => (
                      <div key={item.fileId} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="font-medium truncate" title={item.filename}>
                          {item.filename}
                        </div>
                        <div className="text-gray-600 flex justify-between">
                          <span>{formatSize(item.size)}</span>
                          <span>{formatAge(item.age)} ago</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
