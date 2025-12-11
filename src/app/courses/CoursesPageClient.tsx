'use client';

import { useState, useEffect } from 'react';
import FilterBar from '@/components/course/FilterBar';
import FilteredResults from '@/components/course/FilteredResults';
import { useFilters } from '@/hooks/useFilters';
import { SearchResults, getSearchParamsFromUrl } from '@/lib/search';
import { Course, Resource, LearningPath } from '@/types';

interface CoursesPageClientProps {
  courses: Course[];
  resources: Resource[];
  learningPaths: LearningPath[];
}

export default function CoursesPageClient({ 
  courses, 
  resources, 
  learningPaths
}: CoursesPageClientProps) {
  const [searchResults, setSearchResults] = useState<SearchResults | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Get initial search query from URL
  useEffect(() => {
    const { query } = getSearchParamsFromUrl();
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  }, []);

  // Initialize filters from URL parameters
  const {
    filters,
    availableFilters,
    filteredCourses,
    filteredResources,
    filteredLearningPaths,
    hasActiveFilters,
    activeFilterCount,
    updateFilter,
    clearAllFilters,
  } = useFilters({
    courses,
    resources,
    learningPaths,
  });

  const handleSearchResults = (results: SearchResults) => {
    setSearchResults(results);
    const { query } = getSearchParamsFromUrl();
    setSearchQuery(query);
    setShowSearchResults(results.totalCount > 0 || query.length > 0);
  };

  const handleClearSearch = () => {
    setSearchResults(undefined);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar with Filters */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            筛选条件
          </h2>
          
          <FilterBar
            courses={courses}
            resources={resources}
            learningPaths={learningPaths}
            onSearchResults={handleSearchResults}
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={updateFilter}
            onClearAllFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            showMobileFilters={false}
            className="space-y-6"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <FilteredResults
          {...(searchResults && { searchResults })}
          searchQuery={searchQuery}
          filteredCourses={filteredCourses}
          filteredResources={filteredResources}
          filteredLearningPaths={filteredLearningPaths}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearAllFilters}
          onClearSearch={handleClearSearch}
          showSearchResults={showSearchResults}
          className="space-y-6"
        />
      </div>
    </div>
  );
}