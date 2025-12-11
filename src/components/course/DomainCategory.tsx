import { 
  BuildingOffice2Icon,
  GlobeAltIcon,
  TruckIcon,
  BeakerIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface DomainCategoryProps {
  domain: string;
  count?: number | undefined;
  selected?: boolean;
  onClick?: (() => void) | undefined;
  size?: 'sm' | 'md' | 'lg';
}

const domainConfig = {
  'urban': {
    label: '城市建模',
    icon: BuildingOffice2Icon,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    selectedColor: 'bg-blue-600 text-white border-blue-600',
    description: '城市规划、交通流、人口动态等城市系统建模',
  },
  'environmental': {
    label: '环境建模',
    icon: GlobeAltIcon,
    color: 'bg-green-100 text-green-800 border-green-200',
    selectedColor: 'bg-green-600 text-white border-green-600',
    description: '生态系统、气候变化、环境保护等环境科学建模',
  },
  'transportation': {
    label: '交通建模',
    icon: TruckIcon,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    selectedColor: 'bg-orange-600 text-white border-orange-600',
    description: '交通流量、物流网络、出行行为等交通系统建模',
  },
  'social': {
    label: '社会建模',
    icon: ChartBarIcon,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    selectedColor: 'bg-purple-600 text-white border-purple-600',
    description: '社会网络、群体行为、文化传播等社会科学建模',
  },
  'economics': {
    label: '经济建模',
    icon: BeakerIcon,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    selectedColor: 'bg-yellow-600 text-white border-yellow-600',
    description: '市场动态、经济政策、金融系统等经济学建模',
  },
  'computational': {
    label: '计算建模',
    icon: CpuChipIcon,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    selectedColor: 'bg-gray-600 text-white border-gray-600',
    description: '算法优化、并行计算、模型验证等计算科学方法',
  },
};

const sizeConfig = {
  sm: {
    padding: 'px-3 py-2',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-2',
  },
  md: {
    padding: 'px-4 py-3',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-3',
  },
  lg: {
    padding: 'px-6 py-4',
    text: 'text-lg',
    icon: 'w-6 h-6',
    gap: 'gap-4',
  },
};

export function DomainCategory({ 
  domain, 
  count, 
  selected = false, 
  onClick, 
  size = 'md' 
}: DomainCategoryProps) {
  const config = domainConfig[domain as keyof typeof domainConfig];
  const sizeStyles = sizeConfig[size];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;
  const colorClass = selected ? config.selectedColor : config.color;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-lg border font-medium cursor-pointer
        transition-all duration-200 hover:shadow-md
        ${colorClass} ${sizeStyles.padding} ${sizeStyles.text} ${sizeStyles.gap}
        ${onClick ? 'hover:scale-105' : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={config.description}
      aria-label={`${config.label}${count !== undefined ? ` (${count} 项)` : ''}`}
    >
      <Icon className={sizeStyles.icon} />
      <span>{config.label}</span>
      {count !== undefined && (
        <span className={`
          inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full text-xs font-bold
          ${selected ? 'bg-white/20 text-white' : 'bg-white/80 text-gray-700'}
        `}>
          {count}
        </span>
      )}
    </div>
  );
}

// Component for displaying multiple domain categories
interface DomainCategoryListProps {
  domains: Array<{
    domain: string;
    count?: number;
  }>;
  selectedDomains?: string[];
  onDomainToggle?: ((domain: string) => void) | undefined;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'grid';
}

export function DomainCategoryList({ 
  domains, 
  selectedDomains = [], 
  onDomainToggle, 
  size = 'md',
  layout = 'horizontal'
}: DomainCategoryListProps) {
  const containerClass = layout === 'grid' 
    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'
    : 'flex flex-wrap gap-2';

  return (
    <div className={containerClass}>
      {domains.map(({ domain, count }) => (
        <DomainCategory
          key={domain}
          domain={domain}
          count={count}
          selected={selectedDomains.includes(domain)}
          onClick={onDomainToggle ? () => onDomainToggle(domain) : undefined}
          size={size}
        />
      ))}
    </div>
  );
}