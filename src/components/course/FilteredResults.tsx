'use client';

import { SearchResults as SearchResultsType } from '@/lib/search';
import { Course, Resource, LearningPath } from '@/types';
import SearchResults from './SearchResults';
import NoResults from './NoResults';

interface FilteredResultsProps {
  // Search results
  searchResults?: SearchResultsType;
  searchQuery?: string;
  
  // Filtered data (when not using search)
  filteredCourses?: Course[];
  filteredResources?: Resource[];
  filteredLearningPaths?: LearningPath[];
  
  // Filter state
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  
  // Display options
  showSearchResults?: boolean;
  className?: string;
}

export default function FilteredResults({
  searchResults,
  searchQuery,
  filteredCourses = [],
  filteredResources = [],
  filteredLearningPaths = [],
  hasActiveFilters = false,
  activeFilterCount = 0,
  onClearFilters,
  onClearSearch,
  showSearchResults = false,
  className = ''
}: FilteredResultsProps) {
  // Determine if we should show search results or filtered content
  const isSearchMode = showSearchResults && searchResults && searchQuery;
  
  // Calculate total count
  const totalCount = isSearchMode 
    ? searchResults.totalCount
    : filteredCourses.length + filteredResources.length + filteredLearningPaths.length;

  // Show search results if in search mode
  if (isSearchMode) {
    return (
      <SearchResults
        results={searchResults}
        query={searchQuery}
        className={className}
      />
    );
  }

  // Show no results if no content
  if (totalCount === 0) {
    const noResultsType = hasActiveFilters ? 'filter' : 'general';
    
    return (
      <NoResults
        type={noResultsType}
        activeFilterCount={activeFilterCount}
        {...(onClearFilters && { onClearFilters })}
        {...(onClearSearch && { onClearSearch })}
        className={className}
      />
    );
  }

  // Show filtered content
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          找到 <span className="font-semibold">{totalCount}</span> 个结果
          {hasActiveFilters && (
            <span className="ml-2">
              (应用了 <span className="font-medium">{activeFilterCount}</span> 个筛选条件)
            </span>
          )}
        </div>
      </div>

      {/* Courses Section */}
      {filteredCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2 text-blue-500" />
            课程 ({filteredCourses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Resources Section */}
      {filteredResources.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-green-500" />
            资源 ({filteredResources.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {/* Learning Paths Section */}
      {filteredLearningPaths.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapIcon className="h-6 w-6 mr-2 text-purple-500" />
            学习路径 ({filteredLearningPaths.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLearningPaths.map((path) => (
              <LearningPathCard key={path.id} learningPath={path} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Import required components
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  MapIcon 
} from '@heroicons/react/24/outline';
import { CourseCard } from './CourseCard';
import { ResourceCard } from './ResourceCard';
import { LearningPathCard } from './LearningPathCard';