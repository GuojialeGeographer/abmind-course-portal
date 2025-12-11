import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface FallbackContentProps {
  type: 'unavailable' | 'error' | 'maintenance';
  title?: string | undefined;
  message?: string | undefined;
  suggestions?: string[];
  contactInfo?: {
    email?: string;
    platform?: string;
    url?: string;
  } | undefined;
  onRetry?: (() => void) | undefined;
  showRetry?: boolean;
}

const typeConfig = {
  unavailable: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    title: '资源不可用',
  },
  error: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    title: '加载错误',
  },
  maintenance: {
    icon: InformationCircleIcon,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    title: '维护中',
  },
};

export function FallbackContent({
  type,
  title,
  message,
  suggestions = [],
  contactInfo,
  onRetry,
  showRetry = true,
}: FallbackContentProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {title || config.title}
          </h4>
          
          {message && (
            <p className="text-sm text-gray-700 mb-3">
              {message}
            </p>
          )}

          {suggestions.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 mb-2">建议:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contactInfo && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 mb-2">联系方式:</p>
              <div className="flex items-center gap-4 text-sm">
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    {contactInfo.email}
                  </a>
                )}
                
                {contactInfo.platform && contactInfo.url && (
                  <a
                    href={contactInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contactInfo.platform}
                  </a>
                )}
              </div>
            </div>
          )}

          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized fallback components for different scenarios
interface UnavailableResourceProps {
  resourceType: 'slides' | 'code_repo' | 'recording' | 'reference' | 'course_page';
  resourceTitle?: string | undefined;
  instructorEmail?: string | undefined;
  alternativeUrl?: string | undefined;
  onRetry?: (() => void) | undefined;
}

const resourceTypeLabels = {
  slides: '课件',
  code_repo: '代码仓库',
  recording: '录像',
  reference: '参考资料',
  course_page: '课程页面',
};

export function UnavailableResource({
  resourceType,
  resourceTitle,
  instructorEmail,
  alternativeUrl,
  onRetry,
}: UnavailableResourceProps) {
  const resourceLabel = resourceTypeLabels[resourceType];
  
  const suggestions = [
    '稍后重试访问',
    '检查网络连接',
  ];

  if (alternativeUrl) {
    suggestions.push('尝试访问备用链接');
  }

  if (instructorEmail) {
    suggestions.push('联系讲师获取最新链接');
  }

  return (
    <FallbackContent
      type="unavailable"
      title={`${resourceLabel}暂时无法访问`}
      message={resourceTitle ? `"${resourceTitle}" 当前无法加载` : undefined}
      suggestions={suggestions}
      contactInfo={instructorEmail ? { email: instructorEmail } : undefined}
      onRetry={onRetry}
    />
  );
}

interface MaintenanceNoticeProps {
  expectedDuration?: string | undefined;
  contactInfo?: {
    email?: string;
    platform?: string;
    url?: string;
  } | undefined;
}

export function MaintenanceNotice({ expectedDuration, contactInfo }: MaintenanceNoticeProps) {
  const message = expectedDuration 
    ? `系统正在维护中，预计 ${expectedDuration} 后恢复正常`
    : '系统正在维护中，请稍后再试';

  return (
    <FallbackContent
      type="maintenance"
      message={message}
      suggestions={[
        '请稍后重试',
        '关注官方通知获取最新状态',
      ]}
      contactInfo={contactInfo}
      showRetry={false}
    />
  );
}

interface ErrorFallbackProps {
  error?: string | undefined;
  onRetry?: (() => void) | undefined;
  onReport?: (() => void) | undefined;
}

export function ErrorFallback({ error, onRetry, onReport }: ErrorFallbackProps) {
  const suggestions = [
    '刷新页面重试',
    '清除浏览器缓存',
    '检查网络连接',
  ];

  if (onReport) {
    suggestions.push('报告此问题');
  }

  return (
    <div className="space-y-3">
      <FallbackContent
        type="error"
        message={error || '加载过程中出现错误'}
        suggestions={suggestions}
        onRetry={onRetry}
      />
      
      {onReport && (
        <button
          onClick={onReport}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          报告此问题
        </button>
      )}
    </div>
  );
}