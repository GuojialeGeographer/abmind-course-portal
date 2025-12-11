'use client';

import { useEffect } from 'react';
import { 
  XMarkIcon, 
  FunnelIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { FilterOptions } from '@/lib/filters';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  availableFilters: FilterOptions;
  onFilterChange: (filterType: keyof FilterOptions, values: string[]) => void;
  onClearAll: () => void;
  onApply: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

interface MobileFilterSectionProps {
  title: string;
  filterKey: keyof FilterOptions;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

function MobileFilterSection({ 
  title, 
  filterKey: _filterKey, 
  options, 
  selectedValues, 
  onSelectionChange 
}: MobileFilterSectionProps) {
  const handleToggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onSelectionChange(newValues);
  };

  if (options.length === 0) return null;

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          {selectedValues.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedValues.length}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <button
                key={option}
                onClick={() => handleToggleOption(option)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{option}</span>
                {isSelected && (
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  availableFilters,
  onFilterChange,
  onClearAll,
  onApply,
  hasActiveFilters,
  activeFilterCount
}: FilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filterSections = [
    {
      title: '难度',
      key: 'difficulty' as keyof FilterOptions,
      options: availableFilters.difficulty
    },
    {
      title: '标签',
      key: 'tags' as keyof FilterOptions,
      options: availableFilters.tags
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">筛选</h2>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}
              </span>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="关闭筛选"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filterSections.map((section) => (
            <MobileFilterSection
              key={section.key}
              title={section.title}
              filterKey={section.key}
              options={section.options}
              selectedValues={filters[section.key]}
              onSelectionChange={(values) => onFilterChange(section.key, values)}
            />
          ))}

          {/* No filters available message */}
          {filterSections.every(section => section.options.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-base">暂无可用的筛选选项</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex space-x-3">
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                清除全部
              </button>
            )}
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              应用筛选
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}