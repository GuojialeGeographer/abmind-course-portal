'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SearchEngine, SearchResults, getSearchParamsFromUrl, updateSearchParamsInUrl } from '@/lib/search';
import { Course, Resource, LearningPath } from '@/types';

interface SearchBoxProps {
  courses?: Course[];
  resources?: Resource[];
  learningPaths?: LearningPath[];
  onSearchResults?: (results: SearchResults) => void;
  placeholder?: string;
  className?: string;
  showResultCount?: boolean;
  debounceMs?: number;
}

export default function SearchBox({
  courses = [],
  resources = [],
  learningPaths = [],
  onSearchResults,
  placeholder = '搜索课程、资源和学习路径...',
  className = '',
  showResultCount = true,
  debounceMs = 300
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
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
      setQuery(urlQuery);
    }
  }, []);

  // Debounced search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchEngineRef.current) return;

    setIsSearching(true);
    
    try {
      const searchResults = searchEngineRef.current.search(searchQuery);
      setResults(searchResults);
      onSearchResults?.(searchResults);
      
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
      onSearchResults?.(emptyResults);
    } finally {
      setIsSearching(false);
    }
  }, [onSearchResults]);

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, debounceMs);
  }, [performSearch, debounceMs]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setQuery('');
    const emptyResults = {
      courses: [],
      resources: [],
      learningPaths: [],
      totalCount: 0
    };
    setResults(emptyResults);
    onSearchResults?.(emptyResults);
    updateSearchParamsInUrl('');
  }, [onSearchResults]);

  // Handle form submission (immediate search)
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear debounce timeout and search immediately
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    performSearch(query);
  }, [query, performSearch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon 
              className={`h-5 w-5 transition-colors ${
                isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
              }`}
              aria-hidden="true"
            />
          </div>
          
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     placeholder-gray-500 text-sm
                     transition-colors duration-200"
            aria-label="搜索内容"
            autoComplete="off"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center 
                       text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="清除搜索"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Summary */}
      {showResultCount && query && (
        <div className="mt-2 text-sm text-gray-600">
          {isSearching ? (
            <span className="flex items-center">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              搜索中...
            </span>
          ) : (
            <span>
              找到 <span className="font-semibold">{results.totalCount}</span> 个结果
              {results.totalCount > 0 && (
                <>
                  {results.courses.length > 0 && (
                    <span className="ml-2">
                      课程: <span className="font-medium">{results.courses.length}</span>
                    </span>
                  )}
                  {results.resources.length > 0 && (
                    <span className="ml-2">
                      资源: <span className="font-medium">{results.resources.length}</span>
                    </span>
                  )}
                  {results.learningPaths.length > 0 && (
                    <span className="ml-2">
                      学习路径: <span className="font-medium">{results.learningPaths.length}</span>
                    </span>
                  )}
                </>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}