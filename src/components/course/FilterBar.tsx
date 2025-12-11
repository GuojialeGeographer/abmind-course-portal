'use client';

import { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import SearchBox from './SearchBox';
import FilterDrawer from './FilterDrawer';
import { FilterOptions } from '@/lib/filters';
import { Course, Resource, LearningPath } from '@/types';
import { SearchResults } from '@/lib/search';

interface FilterBarProps {
  // Search props
  courses?: Course[];
  resources?: Resource[];
  learningPaths?: LearningPath[];
  onSearchResults?: (results: SearchResults) => void;
  
  // Filter props
  filters: FilterOptions;
  availableFilters: FilterOptions;
  onFilterChange: (filterType: keyof FilterOptions, values: string[]) => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  
  // UI props
  className?: string;
  showMobileFilters?: boolean;
}

export default function FilterBar({
  courses = [],
  resources = [],
  learningPaths = [],
  onSearchResults,
  filters,
  availableFilters,
  onFilterChange,
  onClearAllFilters,
  hasActiveFilters,
  activeFilterCount,
  className = '',
  showMobileFilters = true
}: FilterBarProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleRemoveFilter = (filterType: keyof FilterOptions, value: string) => {
    const newValues = filters[filterType].filter(v => v !== value);
    onFilterChange(filterType, newValues);
  };

  const handleApplyFilters = () => {
    // Filters are applied in real-time, so this is mainly for mobile UX
    setIsFilterDrawerOpen(false);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1">
            <SearchBox
              courses={courses}
              resources={resources}
              learningPaths={learningPaths}
              {...(onSearchResults && { onSearchResults })}
              placeholder="搜索课程、资源和学习路径..."
              showResultCount={true}
            />
          </div>

          {/* Mobile Filter Button */}
          {showMobileFilters && (
            <div className="sm:hidden">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                筛选
                {activeFilterCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Desktop Filter Toggle */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              高级筛选
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">已应用筛选:</span>
            
            {Object.entries(filters).map(([filterType, values]) => 
              values.map((value: string) => (
                <span
                  key={`${filterType}-${value}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {value}
                  <button
                    onClick={() => handleRemoveFilter(filterType as keyof FilterOptions, value)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    aria-label={`移除筛选条件 ${value}`}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
            
            <button
              onClick={onClearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
            >
              清除全部
            </button>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {hasActiveFilters && (
              <span>
                应用了 <span className="font-medium">{activeFilterCount}</span> 个筛选条件
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        availableFilters={availableFilters}
        onFilterChange={onFilterChange}
        onClearAll={onClearAllFilters}
        onApply={handleApplyFilters}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />
    </>
  );
}