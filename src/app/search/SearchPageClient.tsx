'use client';

import { SearchBox, SearchResults } from '@/components/course';
import { useSearch } from '@/hooks';
import { Course, Resource, LearningPath } from '@/types';

interface SearchPageClientProps {
  courses: Course[];
  resources: Resource[];
  learningPaths: LearningPath[];
}

export default function SearchPageClient({
  courses,
  resources,
  learningPaths
}: SearchPageClientProps) {
  const { query, results, isSearching } = useSearch({
    courses,
    resources,
    learningPaths,
    debounceMs: 300,
    autoSearch: true
  });

  return (
    <div className="space-y-6">
      <SearchBox
        courses={courses}
        resources={resources}
        learningPaths={learningPaths}
        className="w-full"
        showResultCount={true}
        placeholder="搜索课程、资源和学习路径..."
      />

      {isSearching && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">搜索中...</span>
        </div>
      )}

      {!isSearching && (
        <SearchResults
          results={results}
          query={query}
          className="mt-6"
        />
      )}
    </div>
  );
}