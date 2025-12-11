import { Resource } from '@/types';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { DifficultyIndicator } from './DifficultyIndicator';

interface ResourceCardProps {
  resource: Resource;
  showTags?: boolean;
  compact?: boolean;
}

const typeLabels = {
  docs: '文档',
  tutorial: '教程',
  paper: '论文',
  book: '书籍',
  dataset: '数据集',
  tool: '工具',
};

const typeColors = {
  docs: 'bg-blue-100 text-blue-800',
  tutorial: 'bg-green-100 text-green-800',
  paper: 'bg-purple-100 text-purple-800',
  book: 'bg-orange-100 text-orange-800',
  dataset: 'bg-yellow-100 text-yellow-800',
  tool: 'bg-gray-100 text-gray-800',
};

export function ResourceCard({ resource, showTags = true, compact = false }: ResourceCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            {resource.title}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
          </a>
          
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[resource.type]}`}>
              {typeLabels[resource.type]}
            </span>
            
            {resource.difficulty && (
              <DifficultyIndicator difficulty={resource.difficulty} size="sm" />
            )}
            
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              resource.language === 'zh' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {resource.language === 'zh' ? '中文' : 'English'}
            </span>
          </div>
        </div>
      </div>

      {!compact && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {resource.description}
        </p>
      )}

      {showTags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > (compact ? 3 : 5) && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              +{resource.tags.length - (compact ? 3 : 5)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}