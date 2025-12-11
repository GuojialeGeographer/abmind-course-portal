import { Course, Resource, LearningPath } from '@/types';
import { 
  ArrowRightIcon,
  LinkIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  MapIcon
} from '@heroicons/react/24/outline';

interface CrossReferenceProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    type: 'course' | 'resource' | 'learning_path';
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
    tags?: string[];
    url?: string;
  }>;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: (() => void) | undefined;
}

const typeConfig = {
  course: {
    icon: AcademicCapIcon,
    label: '课程',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  resource: {
    icon: DocumentTextIcon,
    label: '资源',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  learning_path: {
    icon: MapIcon,
    label: '学习路径',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export function CrossReference({ 
  title, 
  items, 
  maxItems = 5, 
  showViewAll = true,
  onViewAll 
}: CrossReferenceProps) {
  const displayItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-gray-500" />
          {title}
        </h3>
        {hasMore && showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            查看全部 ({items.length})
            <ArrowRightIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayItems.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-md ${config.bgColor} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {item.url ? (
                      <a
                        href={item.url}
                        target={item.type === 'resource' ? '_blank' : undefined}
                        rel={item.type === 'resource' ? 'noopener noreferrer' : undefined}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </h4>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color} ${config.bgColor}`}>
                      {config.label}
                    </span>
                    
                    {item.difficulty && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && !showViewAll && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <span className="text-sm text-gray-500">
            还有 {items.length - maxItems} 个相关项目
          </span>
        </div>
      )}
    </div>
  );
}

// Specialized components for different types of cross-references
interface RelatedCoursesProps {
  courses: Course[];
  maxItems?: number;
  onViewAll?: (() => void) | undefined;
}

export function RelatedCourses({ courses, maxItems = 5, onViewAll }: RelatedCoursesProps) {
  const items = courses.map(course => ({
    id: course.id,
    title: course.title,
    type: 'course' as const,
    difficulty: course.difficulty,
    tags: course.tags,
    url: `/courses/${course.id}`,
  }));

  return (
    <CrossReference
      title="相关课程"
      items={items}
      maxItems={maxItems}
      onViewAll={onViewAll}
    />
  );
}

interface RelatedResourcesProps {
  resources: Resource[];
  maxItems?: number;
  onViewAll?: (() => void) | undefined;
}

export function RelatedResources({ resources, maxItems = 5, onViewAll }: RelatedResourcesProps) {
  const items = resources.map(resource => ({
    id: resource.id,
    title: resource.title,
    type: 'resource' as const,
    difficulty: resource.difficulty,
    tags: resource.tags,
    url: resource.url,
  }));

  return (
    <CrossReference
      title="相关资源"
      items={items}
      maxItems={maxItems}
      onViewAll={onViewAll}
    />
  );
}

interface RelatedLearningPathsProps {
  learningPaths: LearningPath[];
  maxItems?: number;
  onViewAll?: (() => void) | undefined;
}

export function RelatedLearningPaths({ learningPaths, maxItems = 5, onViewAll }: RelatedLearningPathsProps) {
  const items = learningPaths.map(path => ({
    id: path.id,
    title: path.title,
    type: 'learning_path' as const,
    tags: [], // Learning paths don't have tags in the current schema
    url: `/learning-paths/${path.id}`,
  }));

  return (
    <CrossReference
      title="相关学习路径"
      items={items}
      maxItems={maxItems}
      onViewAll={onViewAll}
    />
  );
}