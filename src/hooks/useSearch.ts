import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { searchData, SearchItem } from '@/data/searchData';

interface UseSearchOptions {
  keys?: string[];
  threshold?: number;
  limit?: number;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract complex expressions for dependency array
  const keysString = options.keys?.join(',') || 'title,description,category';
  const threshold = options.threshold ?? 0.3;
  const limit = options.limit ?? 10;

  const fuse = useMemo(() => {
    const defaultOptions = {
      keys: ['title', 'description', 'category'],
      threshold: 0.3,
      limit: 10,
      ...options,
    };

    return new Fuse(searchData, defaultOptions);
  }, [keysString, threshold, limit, options]);

  // Perform search when query changes
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Debounce the search to prevent excessive API calls
    searchTimeoutRef.current = setTimeout(() => {
      try {
        const searchResults = fuse.search(query.trim());
        const items = searchResults.map(result => result.item);
        setResults(items);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, fuse]);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  return {
    query,
    results,
    isSearching,
    search,
    clearSearch,
    hasResults: results.length > 0,
  };
};
