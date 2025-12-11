'use client';

import { useState, useEffect, useCallback } from 'react';
import { Course, Resource, LearningPath } from '@/types';
import { 
  FilterEngine, 
  FilterOptions, 
  getFiltersFromUrl, 
  updateFiltersInUrl,
  hasActiveFilters,
  clearAllFilters,
  getActiveFilterCount
} from '@/lib/filters';

interface UseFiltersOptions {
  courses?: Course[];
  resources?: Resource[];
  learningPaths?: LearningPath[];
  autoApply?: boolean;
}

interface UseFiltersReturn {
  // Filter state
  filters: FilterOptions;
  availableFilters: FilterOptions;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  
  // Filtered results
  filteredCourses: Course[];
  filteredResources: Resource[];
  filteredLearningPaths: LearningPath[];
  
  // Filter actions
  updateFilter: (filterType: keyof FilterOptions, values: string[]) => void;
  toggleFilterValue: (filterType: keyof FilterOptions, value: string) => void;
  clearFilter: (filterType: keyof FilterOptions) => void;
  clearAllFilters: () => void;
  resetFilters: () => void;
}

export function useFilters({
  courses = [],
  resources = [],
  learningPaths = [],
  autoApply = true
}: UseFiltersOptions = {}): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: [],
    tags: [],
    year: [],
    type: [],
    language: [],
    domains: []
  });

  const [availableFilters, setAvailableFilters] = useState<FilterOptions>({
    difficulty: [],
    tags: [],
    year: [],
    type: [],
    language: [],
    domains: []
  });

  // Load initial filters from URL
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFilters(urlFilters);
  }, []);

  // Update available filters when data changes
  useEffect(() => {
    const available = FilterEngine.getAvailableFilters(courses, resources, learningPaths);
    setAvailableFilters(available);
  }, [courses, resources, learningPaths]);

  // Apply filters to get filtered results
  const filteredCourses = FilterEngine.filterCourses(courses, filters);
  const filteredResources = FilterEngine.filterResources(resources, filters);
  const filteredLearningPaths = FilterEngine.filterLearningPaths(learningPaths, filters);

  // Update filter function
  const updateFilter = useCallback((filterType: keyof FilterOptions, values: string[]) => {
    const newFilters = {
      ...filters,
      [filterType]: values
    };
    
    setFilters(newFilters);
    
    if (autoApply) {
      updateFiltersInUrl(newFilters);
    }
  }, [filters, autoApply]);

  // Toggle a single filter value
  const toggleFilterValue = useCallback((filterType: keyof FilterOptions, value: string) => {
    const currentValues = filters[filterType];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    updateFilter(filterType, newValues);
  }, [filters, updateFilter]);

  // Clear a specific filter
  const clearFilter = useCallback((filterType: keyof FilterOptions) => {
    updateFilter(filterType, []);
  }, [updateFilter]);

  // Clear all filters
  const clearAllFiltersHandler = useCallback(() => {
    const clearedFilters = clearAllFilters();
    setFilters(clearedFilters);
    
    if (autoApply) {
      updateFiltersInUrl(clearedFilters);
    }
  }, [autoApply]);

  // Reset to initial state
  const resetFilters = useCallback(() => {
    clearAllFiltersHandler();
  }, [clearAllFiltersHandler]);

  return {
    // Filter state
    filters,
    availableFilters,
    hasActiveFilters: hasActiveFilters(filters),
    activeFilterCount: getActiveFilterCount(filters),
    
    // Filtered results
    filteredCourses,
    filteredResources,
    filteredLearningPaths,
    
    // Filter actions
    updateFilter,
    toggleFilterValue,
    clearFilter,
    clearAllFilters: clearAllFiltersHandler,
    resetFilters
  };
}