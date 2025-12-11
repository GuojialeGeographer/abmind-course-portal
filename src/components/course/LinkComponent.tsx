import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface LinkComponentProps {
  href: string;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
  status?: 'available' | 'unavailable' | 'checking' | 'unknown';
  fallbackContent?: ReactNode | undefined;
  title?: string | undefined;
  'aria-label'?: string | undefined;
}

// Utility function to determine if a URL is external (server-side safe)
function isExternalUrlSafe(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Check against common internal patterns
    return !url.startsWith('/') && !url.startsWith('#') && urlObj.protocol.startsWith('http');
  } catch {
    // If URL parsing fails, assume it's a relative URL (internal)
    return false;
  }
}

export function LinkComponent({ 
  href, 
  children, 
  className = '', 
  showIcon = true,
  status = 'unknown',
  fallbackContent,
  title,
  'aria-label': ariaLabel,
  ...props 
}: LinkComponentProps) {
  const isExternal = isExternalUrlSafe(href);
  
  // Status indicator component
  const StatusIndicator = () => {
    if (!showIcon) return null;

    switch (status) {
      case 'unavailable':
        return (
          <ExclamationTriangleIcon 
            className="w-4 h-4 text-red-500 flex-shrink-0" 
            title="链接不可用"
          />
        );
      case 'checking':
        return (
          <ClockIcon 
            className="w-4 h-4 text-yellow-500 flex-shrink-0 animate-spin" 
            title="检查链接状态中"
          />
        );
      case 'available':
      case 'unknown':
      default:
        return isExternal ? (
          <ArrowTopRightOnSquareIcon 
            className="w-4 h-4 text-gray-400 flex-shrink-0" 
            title="外部链接"
          />
        ) : null;
    }
  };

  // Handle unavailable links
  if (status === 'unavailable' && fallbackContent) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-gray-500 line-through">{children}</span>
        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
        <div className="ml-2 text-sm text-gray-600">
          {fallbackContent}
        </div>
      </div>
    );
  }

  // Base link props
  const baseLinkProps = {
    className: `inline-flex items-center gap-2 transition-colors ${className}`,
    title: title || (isExternal ? `外部链接: ${href}` : undefined),
    'aria-label': ariaLabel,
    ...props,
  };

  // External link
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...baseLinkProps}
      >
        {children}
        <StatusIndicator />
      </a>
    );
  }

  // Internal link
  return (
    <Link href={href} {...baseLinkProps}>
      {children}
      <StatusIndicator />
    </Link>
  );
}

// Specialized components for different types of links
interface ExternalLinkProps extends Omit<LinkComponentProps, 'href'> {
  url: string;
}

export function ExternalLink({ url, children, className = '', ...props }: ExternalLinkProps) {
  return (
    <LinkComponent
      href={url}
      className={`text-blue-600 hover:text-blue-800 ${className}`}
      {...props}
    >
      {children}
    </LinkComponent>
  );
}

interface MaterialLinkProps {
  type: 'slides' | 'code_repo' | 'recording' | 'reference';
  url: string;
  title?: string | undefined;
  status?: 'available' | 'unavailable' | 'checking' | 'unknown';
  fallbackContent?: ReactNode | undefined;
}

const materialConfig = {
  slides: {
    label: '课件',
    icon: 'PPT',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  code_repo: {
    label: '代码仓库',
    icon: 'CODE',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
  recording: {
    label: '录像',
    icon: 'REC',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  reference: {
    label: '参考资料',
    icon: 'REF',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
};

export function MaterialLink({ 
  type, 
  url, 
  title, 
  status = 'unknown',
  fallbackContent 
}: MaterialLinkProps) {
  const config = materialConfig[type];

  if (status === 'unavailable' && fallbackContent) {
    return (
      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${config.bgColor} rounded-md flex items-center justify-center opacity-50`}>
            <span className={`${config.textColor} text-xs font-medium`}>{config.icon}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 line-through">
            {title || config.label}
          </p>
          <div className="text-xs text-gray-600 mt-1">
            {fallbackContent}
          </div>
        </div>
        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      </div>
    );
  }

  return (
    <LinkComponent
      href={url}
      className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      status={status}
      showIcon={true}
    >
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 ${config.bgColor} rounded-md flex items-center justify-center`}>
          <span className={`${config.textColor} text-xs font-medium`}>{config.icon}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {title || config.label}
        </p>
      </div>
    </LinkComponent>
  );
}