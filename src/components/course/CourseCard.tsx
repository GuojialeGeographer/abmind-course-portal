import Link from 'next/link';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  showTags?: boolean;
  compact?: boolean;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const typeLabels = {
  course: '课程',
  workshop: '工作坊',
  reading_group: '读书会',
};

export function CourseCard({ course, showTags = true, compact = false }: CourseCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link 
            href={`/courses/${course.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {course.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}>
              {course.difficulty}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {typeLabels[course.type]}
            </span>
            <span className="text-sm text-gray-500">{course.year}</span>
          </div>
        </div>
      </div>

      {!compact && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.summary}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div>
          <span className="font-medium">讲师:</span> {course.instructors.join(', ')}
        </div>
        <div>
          {course.sessions.length} 节课
        </div>
      </div>

      {showTags && course.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > (compact ? 3 : 5) && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              +{course.tags.length - (compact ? 3 : 5)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}