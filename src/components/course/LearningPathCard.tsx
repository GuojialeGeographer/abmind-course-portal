import { LearningPath } from '@/types';
import { 
  ClockIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

interface LearningPathCardProps {
  learningPath: LearningPath;
  progress?: number; // Progress percentage (0-100)
  compact?: boolean;
}

export function LearningPathCard({ learningPath, progress, compact = false }: LearningPathCardProps) {
  const completedSteps = progress ? Math.floor((progress / 100) * learningPath.steps.length) : 0;
  const totalSteps = learningPath.steps.length;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {learningPath.title}
          </h3>
          
          {!compact && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {learningPath.description}
            </p>
          )}
        </div>
      </div>

      {/* Progress visualization */}
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>学习进度</span>
            <span>{completedSteps}/{totalSteps} 步骤</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {progress.toFixed(0)}% 完成
          </div>
        </div>
      )}

      {/* Learning path metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">适合人群:</span>
          <span>{learningPath.recommended_audience}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClockIcon className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">预计时长:</span>
          <span>{learningPath.estimated_duration}</span>
        </div>
      </div>

      {/* Learning steps preview */}
      {!compact && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">学习路径:</h4>
          <div className="space-y-2">
            {learningPath.steps.slice(0, 3).map((step, index) => (
              <div key={step.order} className="flex items-center gap-2 text-sm">
                {progress !== undefined && index < completedSteps ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className={`flex-1 ${step.optional ? 'text-gray-500 italic' : 'text-gray-700'}`}>
                  {step.order}. {step.note}
                  {step.optional && ' (可选)'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  step.type === 'course' 
                    ? 'bg-blue-100 text-blue-700'
                    : step.type === 'resource'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {step.type === 'course' ? '课程' : step.type === 'resource' ? '资源' : '实践'}
                </span>
              </div>
            ))}
            
            {learningPath.steps.length > 3 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
                <span>还有 {learningPath.steps.length - 3} 个步骤...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <span>{progress !== undefined && progress > 0 ? '继续学习' : '开始学习'}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}