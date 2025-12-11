'use client';

import Link from 'next/link';
import { SearchResults as SearchResultsType, SearchResult, highlightMatches } from '@/lib/search';
import { Course, Resource, LearningPath } from '@/types';
import NoResults from './NoResults';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  MapIcon,
  CalendarIcon,
  TagIcon,
  UserGroupIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface SearchResultsProps {
  results: SearchResultsType;
  query: string;
  className?: string;
}

interface SearchResultItemProps<T> {
  result: SearchResult<T>;
  type: 'course' | 'resource' | 'learningPath';
}

function SearchResultItem<T extends Course | Resource | LearningPath>({ 
  result, 
  type 
}: SearchResultItemProps<T>) {
  const { item, matches } = result;

  const getIcon = () => {
    switch (type) {
      case 'course':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
      case 'resource':
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case 'learningPath':
        return <MapIcon className="h-5 w-5 text-purple-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'course':
        return '课程';
      case 'resource':
        return '资源';
      case 'learningPath':
        return '学习路径';
    }
  };

  const getHref = () => {
    switch (type) {
      case 'course':
        return `/courses/${item.id}`;
      case 'resource':
        return (item as Resource).url;
      case 'learningPath':
        return `/learning-paths/${item.id}`;
    }
  };

  const isExternalLink = type === 'resource';

  const highlightedTitle = highlightMatches(item.title, matches, 'bg-yellow-200 font-semibold');
  
  let highlightedDescription = '';
  if ('summary' in item) {
    highlightedDescription = highlightMatches(item.summary, matches, 'bg-yellow-200');
  } else if ('description' in item) {
    highlightedDescription = highlightMatches(item.description, matches, 'bg-yellow-200');
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {getTypeLabel()}
            </span>
            
            {type === 'course' && (
              <>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {(item as Course).year}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {(item as Course).difficulty}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isExternalLink ? (
              <a
                href={getHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              />
            ) : (
              <Link
                href={getHref()}
                className="hover:text-blue-600 transition-colors"
                dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              />
            )}
            {isExternalLink && (
              <LinkIcon className="inline h-4 w-4 ml-1 text-gray-400" />
            )}
          </h3>

          {highlightedDescription && (
            <p 
              className="text-gray-600 text-sm mb-3 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {type === 'course' && (
              <>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {(item as Course).instructors.join(', ')}
                </div>
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  {(item as Course).tags.slice(0, 3).join(', ')}
                  {(item as Course).tags.length > 3 && '...'}
                </div>
              </>
            )}
            
            {type === 'resource' && (
              <div className="flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                {(item as Resource).tags.slice(0, 3).join(', ')}
                {(item as Resource).tags.length > 3 && '...'}
              </div>
            )}

            {type === 'learningPath' && (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {(item as LearningPath).estimated_duration}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResults({ results, query, className = '' }: SearchResultsProps) {
  const { courses, resources, learningPaths, totalCount } = results;

  if (!query.trim()) {
    return null;
  }

  if (totalCount === 0) {
    return (
      <NoResults
        type="search"
        query={query}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {courses.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2 text-blue-500" />
            课程 ({courses.length})
          </h2>
          <div className="space-y-4">
            {courses.map((result) => (
              <SearchResultItem
                key={result.item.id}
                result={result}
                type="course"
              />
            ))}
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-green-500" />
            资源 ({resources.length})
          </h2>
          <div className="space-y-4">
            {resources.map((result) => (
              <SearchResultItem
                key={result.item.id}
                result={result}
                type="resource"
              />
            ))}
          </div>
        </section>
      )}

      {learningPaths.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapIcon className="h-6 w-6 mr-2 text-purple-500" />
            学习路径 ({learningPaths.length})
          </h2>
          <div className="space-y-4">
            {learningPaths.map((result) => (
              <SearchResultItem
                key={result.item.id}
                result={result}
                type="learningPath"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

