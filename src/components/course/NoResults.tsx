'use client';

import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  AcademicCapIcon,
  BookOpenIcon,
  MapIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface NoResultsProps {
  type: 'search' | 'filter' | 'general';
  query?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  suggestions?: string[];
  className?: string;
}

interface SuggestionItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const popularContent: SuggestionItem[] = [
  {
    title: 'Mesa 框架基础',
    description: '学习 Mesa 框架的基础知识和核心概念',
    href: '/courses/mesa-basics',
    icon: AcademicCapIcon
  },
  {
    title: '城市建模入门',
    description: '使用 ABM 进行城市系统建模的入门课程',
    href: '/courses/urban-modeling',
    icon: AcademicCapIcon
  },
  {
    title: 'ABM 学习路径',
    description: '从零开始的完整 ABM 学习路径',
    href: '/learning-paths/abm-beginner',
    icon: MapIcon
  },
  {
    title: 'Mesa 官方文档',
    description: 'Mesa 框架的官方文档和 API 参考',
    href: '/resources/mesa-docs',
    icon: BookOpenIcon
  }
];

const searchSuggestions = [
  'Mesa',
  'ABM',
  '城市建模',
  '智能体',
  'Python',
  '仿真',
  '复杂系统',
  '网络分析'
];

export default function NoResults({
  type,
  query,
  activeFilterCount = 0,
  onClearFilters,
  onClearSearch,
  suggestions = searchSuggestions,
  className = ''
}: NoResultsProps) {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <MagnifyingGlassIcon className="h-16 w-16 text-gray-300" />;
      case 'filter':
        return <FunnelIcon className="h-16 w-16 text-gray-300" />;
      default:
        return <ExclamationTriangleIcon className="h-16 w-16 text-gray-300" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'search':
        return query ? `未找到 "${query}" 的相关结果` : '未找到搜索结果';
      case 'filter':
        return '当前筛选条件下没有匹配的内容';
      default:
        return '暂无内容';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'search':
        return '尝试使用不同的关键词，或浏览下面的推荐内容';
      case 'filter':
        return '尝试调整筛选条件，或清除部分筛选来查看更多内容';
      default:
        return '请稍后再试，或浏览其他内容';
    }
  };

  const generateAlternativeSearchTerms = (originalQuery: string): string[] => {
    if (!originalQuery) return suggestions.slice(0, 4);

    const alternatives: string[] = [];
    const queryLower = originalQuery.toLowerCase();

    // Add related terms based on common patterns
    if (queryLower.includes('mesa')) {
      alternatives.push('ABM', 'Python', '智能体建模');
    }
    if (queryLower.includes('城市') || queryLower.includes('urban')) {
      alternatives.push('交通建模', '环境仿真', '空间分析');
    }
    if (queryLower.includes('abm') || queryLower.includes('智能体')) {
      alternatives.push('Mesa', '复杂系统', '仿真建模');
    }
    if (queryLower.includes('python')) {
      alternatives.push('Mesa', 'NetworkX', '数据分析');
    }

    // Fill with general suggestions if not enough alternatives
    const remaining = 4 - alternatives.length;
    if (remaining > 0) {
      alternatives.push(...suggestions.slice(0, remaining));
    }

    return alternatives.slice(0, 4);
  };

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Icon */}
      <div className="mb-6">
        {getIcon()}
      </div>

      {/* Title and Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {getTitle()}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {getDescription()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {type === 'search' && onClearSearch && (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            清除搜索
          </button>
        )}

        {type === 'filter' && activeFilterCount > 0 && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            清除筛选 ({activeFilterCount})
          </button>
        )}

        <Link
          href="/courses"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <AcademicCapIcon className="h-4 w-4 mr-2" />
          浏览所有课程
        </Link>

        <Link
          href="/resources"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <BookOpenIcon className="h-4 w-4 mr-2" />
          浏览资源库
        </Link>
      </div>

      {/* Search Suggestions */}
      {type === 'search' && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            尝试搜索这些关键词：
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {generateAlternativeSearchTerms(query || '').map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  // This would trigger a new search with the suggestion
                  // Implementation depends on how search is handled in the parent component
                  console.log('Search suggestion clicked:', suggestion);
                }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Content Recommendations */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          推荐内容：
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {popularContent.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <IconComponent className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                  <h5 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          没有找到您需要的内容？
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="mailto:contact@abmind.org"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            联系我们
          </a>
          <a
            href="/about#community"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            加入社区
          </a>
          <a
            href="/about#contribute"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            贡献内容
          </a>
        </div>
      </div>
    </div>
  );
}