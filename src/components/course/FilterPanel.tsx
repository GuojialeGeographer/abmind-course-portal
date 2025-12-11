'use client';

import { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';
import { FilterOptions } from '@/lib/filters';
import { DomainCategoryList } from './DomainCategory';

interface FilterPanelProps {
  filters: FilterOptions;
  availableFilters: FilterOptions;
  onFilterChange: (filterType: keyof FilterOptions, values: string[]) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  className?: string;
}

interface FilterSectionProps {
  title: string;
  filterKey: keyof FilterOptions;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  maxVisible?: number;
}

function FilterSection({ 
  title, 
  filterKey: _filterKey, 
  options, 
  selectedValues, 
  onSelectionChange,
  maxVisible = 5 
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  const handleToggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onSelectionChange(newValues);
  };

  const handleClearSection = () => {
    onSelectionChange([]);
  };

  if (options.length === 0) return null;

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {selectedValues.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDownIcon 
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {/* Clear section button */}
          {selectedValues.length > 0 && (
            <button
              onClick={handleClearSection}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              清除 {title}
            </button>
          )}

          {/* Filter options */}
          <div className="space-y-1">
            {visibleOptions.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleOption(option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">{option}</span>
                </label>
              );
            })}
          </div>

          {/* Show more/less button */}
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {showAll ? '显示更少' : `显示更多 (${options.length - maxVisible})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DomainFilterSection({ 
  title, 
  selectedValues, 
  onSelectionChange,
  availableDomains
}: {
  title: string;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  availableDomains: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(true); // Domains expanded by default

  const handleDomainToggle = (domain: string) => {
    const newValues = selectedValues.includes(domain)
      ? selectedValues.filter(v => v !== domain)
      : [...selectedValues, domain];
    onSelectionChange(newValues);
  };

  const handleClearSection = () => {
    onSelectionChange([]);
  };

  if (availableDomains.length === 0) return null;

  // Convert available domains to domain objects with counts
  const domainData = availableDomains.map(domain => ({
    domain
    // count is optional, so we omit it
  }));

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {selectedValues.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDownIcon 
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-3">
          {/* Clear section button */}
          {selectedValues.length > 0 && (
            <button
              onClick={handleClearSection}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              清除 {title}
            </button>
          )}

          {/* Domain categories */}
          <DomainCategoryList
            domains={domainData}
            selectedDomains={selectedValues}
            onDomainToggle={handleDomainToggle}
            size="sm"
            layout="grid"
          />
        </div>
      )}
    </div>
  );
}

export default function FilterPanel({
  filters,
  availableFilters,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
  activeFilterCount,
  className = ''
}: FilterPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filterSections = [
    {
      title: '应用领域',
      key: 'domains' as keyof FilterOptions,
      options: availableFilters.domains,
      isSpecial: true
    },
    {
      title: '难度',
      key: 'difficulty' as keyof FilterOptions,
      options: availableFilters.difficulty
    },
    {
      title: '标签',
      key: 'tags' as keyof FilterOptions,
      options: availableFilters.tags,
      maxVisible: 8
    },
    {
      title: '年份',
      key: 'year' as keyof FilterOptions,
      options: availableFilters.year
    },
    {
      title: '类型',
      key: 'type' as keyof FilterOptions,
      options: availableFilters.type
    },
    {
      title: '语言',
      key: 'language' as keyof FilterOptions,
      options: availableFilters.language
    }
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">筛选</h2>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount} 个筛选条件
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              清除全部
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isCollapsed ? '展开筛选' : '收起筛选'}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter sections */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {filterSections.map((section) => {
            if (section.key === 'domains') {
              return (
                <DomainFilterSection
                  key={section.key}
                  title={section.title}
                  selectedValues={filters[section.key]}
                  onSelectionChange={(values) => onFilterChange(section.key, values)}
                  availableDomains={section.options}
                />
              );
            }
            
            return (
              <FilterSection
                key={section.key}
                title={section.title}
                filterKey={section.key}
                options={section.options}
                selectedValues={filters[section.key]}
                onSelectionChange={(values) => onFilterChange(section.key, values)}
                maxVisible={section.maxVisible || 5}
              />
            );
          })}

          {/* No filters available message */}
          {filterSections.every(section => section.options.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <FunnelIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">暂无可用的筛选选项</p>
            </div>
          )}
        </div>
      )}

      {/* Active filters summary (when collapsed) */}
      {isCollapsed && hasActiveFilters && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([filterType, values]) => 
              values.map((value: string) => (
                <span
                  key={`${filterType}-${value}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {value}
                  <button
                    onClick={() => {
                      const newValues = filters[filterType as keyof FilterOptions].filter(v => v !== value);
                      onFilterChange(filterType as keyof FilterOptions, newValues);
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    aria-label={`移除筛选条件 ${value}`}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}