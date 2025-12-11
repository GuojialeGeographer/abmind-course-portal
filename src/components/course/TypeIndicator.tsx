
import { 
  AcademicCapIcon, 
  WrenchScrewdriverIcon, 
  BookOpenIcon 
} from '@heroicons/react/24/outline';

interface TypeIndicatorProps {
  type: 'course' | 'workshop' | 'reading_group';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}

const typeConfig = {
  course: {
    label: '课程',
    icon: AcademicCapIcon,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  workshop: {
    label: '工作坊',
    icon: WrenchScrewdriverIcon,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  reading_group: {
    label: '读书会',
    icon: BookOpenIcon,
    color: 'bg-green-100 text-green-800 border-green-200',
  },
};

const sizeConfig = {
  sm: {
    text: 'text-xs',
    padding: 'px-2 py-0.5',
    icon: 'w-3 h-3',
    gap: 'gap-1',
  },
  md: {
    text: 'text-sm',
    padding: 'px-2.5 py-1',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
  lg: {
    text: 'text-base',
    padding: 'px-3 py-1.5',
    icon: 'w-5 h-5',
    gap: 'gap-2',
  },
};

export function TypeIndicator({ 
  type, 
  size = 'md', 
  showIcon = true, 
  showLabel = true 
}: TypeIndicatorProps) {
  const config = typeConfig[type];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeStyles.text} ${sizeStyles.padding} ${sizeStyles.gap}`}
      title={`类型: ${config.label}`}
    >
      {showIcon && <Icon className={sizeStyles.icon} />}
      {showLabel && config.label}
    </span>
  );
}