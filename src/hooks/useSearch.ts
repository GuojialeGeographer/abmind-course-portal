'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchEngine, SearchResults, getSearchParamsFromUrl, updateSearchParamsInUrl } from '@/lib/search';
import { Course, Resource, LearningPath } from '@/types';

interface UseSearchOptions {
  courses?: Course[];
  resources?: Resource[];
  learningPaths?: LearningPath[];
  debounceMs?: number;
  autoSearch?: boolean;
}

interface UseSearchReturn {
  query: string;
  results: SearchResults;
  isSearching: boolean;
  setQuery: (query: string) => void;
  search: (query?: string) => void;
  clearSearch: () => void;
  hasResults: boolean;
}

export function useSearch({
  courses = [],
  resources = [],
  learningPaths = [],
  debounceMs = 300,
  autoSearch = true
}: UseSearchOptions = {}): UseSearchReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResults>({
    courses: [],
    resources: [],
    learningPaths: [],
    totalCount: 0
  });
  const [isSearching, setIsSearching] = useState(false);
  
  const searchEngineRef = useRef<SearchEngine | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize search engine
  useEffect(() => {
    searchEngineRef.current = new SearchEngine(courses, resources, learningPaths);
  }, [courses, resources, learningPaths]);

  // Load initial search query from URL
  useEffect(() => {
    const { query: urlQuery } = getSearchParamsFromUrl();
    if (urlQuery) {
      setQueryState(urlQuery);
      if (autoSearch && searchEngineRef.current) {
        performSearch(urlQuery);
      }
    }
  }, [autoSearch]);

  // Perform search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchEngineRef.current) return;

    setIsSearching(true);
    
    try {
      const searchResults = searchEngineRef.current.search(searchQuery);
      setResults(searchResults);
      
      // Update URL with search query
      updateSearchParamsInUrl(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
      // Reset results on error
      const emptyResults = {
        courses: [],
        resources: [],
        learningPaths: [],
        totalCount: 0
      };
      setResults(emptyResults);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Set query with optional debounced search
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);

    if (!autoSearch) return;

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, debounceMs);
  }, [autoSearch, debounceMs, performSearch]);

  // Manual search function
  const search = useCallback((searchQuery?: string) => {
    const queryToSearch = searchQuery ?? query;
    
    // Clear debounce timeout and search immediately
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    performSearch(queryToSearch);
  }, [query, performSearch]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setQueryState('');
    const emptyResults = {
      courses: [],
      resources: [],
      learningPaths: [],
      totalCount: 0
    };
    setResults(emptyResults);
    updateSearchParamsInUrl('');
    
    // Clear any pending debounced search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const hasResults = results.totalCount > 0;

  return {
    query,
    results,
    isSearching,
    setQuery,
    search,
    clearSearch,
    hasResults
  };
}