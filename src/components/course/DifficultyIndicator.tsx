

interface DifficultyIndicatorProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const difficultyConfig = {
  beginner: {
    label: '初级',
    color: 'bg-green-100 text-green-800 border-green-200',
    dots: 1,
  },
  intermediate: {
    label: '中级',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dots: 2,
  },
  advanced: {
    label: '高级',
    color: 'bg-red-100 text-red-800 border-red-200',
    dots: 3,
  },
};

const sizeConfig = {
  sm: {
    text: 'text-xs',
    padding: 'px-2 py-0.5',
    dot: 'w-1.5 h-1.5',
    gap: 'gap-0.5',
  },
  md: {
    text: 'text-sm',
    padding: 'px-2.5 py-1',
    dot: 'w-2 h-2',
    gap: 'gap-1',
  },
  lg: {
    text: 'text-base',
    padding: 'px-3 py-1.5',
    dot: 'w-2.5 h-2.5',
    gap: 'gap-1',
  },
};

export function DifficultyIndicator({ 
  difficulty, 
  size = 'md', 
  showLabel = true 
}: DifficultyIndicatorProps) {
  const config = difficultyConfig[difficulty];
  const sizeStyles = sizeConfig[size];

  if (showLabel) {
    return (
      <span 
        className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeStyles.text} ${sizeStyles.padding}`}
        title={`难度: ${config.label}`}
      >
        {config.label}
      </span>
    );
  }

  // Show dots only
  return (
    <div 
      className={`inline-flex items-center ${sizeStyles.gap}`}
      title={`难度: ${config.label}`}
      aria-label={`难度: ${config.label}`}
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={`rounded-full ${sizeStyles.dot} ${
            index < config.dots 
              ? difficulty === 'beginner' 
                ? 'bg-green-500'
                : difficulty === 'intermediate'
                ? 'bg-yellow-500'
                : 'bg-red-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}