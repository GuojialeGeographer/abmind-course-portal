'use client';

import { useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagFilter({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  placeholder = "选择标签..." 
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className="relative">
      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                aria-label={`移除标签 ${tag}`}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            清除全部
          </button>
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedTags.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
          {selectedTags.length === 0 
            ? placeholder 
            : `已选择 ${selectedTags.length} 个标签`
          }
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {availableTags.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              暂无可用标签
            </div>
          ) : (
            <div className="py-1">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tag}</span>
                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}