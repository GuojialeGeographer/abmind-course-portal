'use client';

import { 
  StarIcon,
  AcademicCapIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { Course, Domain } from '@/types';
import { DomainDetector, DOMAIN_CONFIG } from '@/lib/domains';
import { DomainCategory } from './DomainCategory';

interface DomainExpertiseLevel {
  domain: Domain;
  level: 'novice' | 'intermediate' | 'advanced' | 'expert';
  courseCount: number;
  courses: Course[];
  description: string;
}

interface DomainExpertiseProps {
  courses: Course[];
  completedCourseIds?: string[];
  showDetails?: boolean;
}

const expertiseLevels = {
  novice: {
    label: '入门',
    description: '刚开始接触该领域',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: AcademicCapIcon,
    minCourses: 0,
    maxCourses: 1
  },
  intermediate: {
    label: '进阶',
    description: '对该领域有基本了解',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: StarIcon,
    minCourses: 2,
    maxCourses: 4
  },
  advanced: {
    label: '高级',
    description: '在该领域有深入理解',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: TrophyIcon,
    minCourses: 5,
    maxCourses: 8
  },
  expert: {
    label: '专家',
    description: '该领域的专业人士',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: SparklesIcon,
    minCourses: 9,
    maxCourses: Infinity
  }
};

export function DomainExpertise({ 
  courses, 
  completedCourseIds = [], 
  showDetails = true 
}: DomainExpertiseProps) {
  // Calculate expertise levels for each domain
  const calculateExpertiseLevels = (): DomainExpertiseLevel[] => {
    const domainCourses: Record<Domain, Course[]> = {} as any;
    
    // Initialize domain course lists
    Object.keys(DOMAIN_CONFIG).forEach(domain => {
      domainCourses[domain as Domain] = [];
    });

    // Group courses by domain
    courses.forEach(course => {
      const courseDomains = DomainDetector.detectCourseDomains(course);
      courseDomains.forEach(domain => {
        domainCourses[domain].push(course);
      });
    });

    // Calculate expertise level for each domain
    return Object.entries(domainCourses).map(([domain, domainCourseList]) => {
      const completedCount = domainCourseList.filter(course => 
        completedCourseIds.includes(course.id)
      ).length;

      let level: DomainExpertiseLevel['level'] = 'novice';
      
      if (completedCount >= expertiseLevels.expert.minCourses) {
        level = 'expert';
      } else if (completedCount >= expertiseLevels.advanced.minCourses) {
        level = 'advanced';
      } else if (completedCount >= expertiseLevels.intermediate.minCourses) {
        level = 'intermediate';
      }

      return {
        domain: domain as Domain,
        level,
        courseCount: completedCount,
        courses: domainCourseList.filter(course => completedCourseIds.includes(course.id)),
        description: expertiseLevels[level].description
      };
    }).filter(expertise => expertise.courseCount > 0); // Only show domains with completed courses
  };

  const expertiseLevels_calculated = calculateExpertiseLevels();

  if (expertiseLevels_calculated.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <StarIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">领域专业度</h3>
        </div>
        <div className="text-center py-8">
          <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">完成课程后，这里将显示您在各个领域的专业度水平。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <StarIcon className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">领域专业度</h3>
      </div>

      <div className="space-y-6">
        {/* Expertise overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertiseLevels_calculated.map((expertise) => {
            const levelConfig = expertiseLevels[expertise.level];
            const Icon = levelConfig.icon;

            return (
              <div
                key={expertise.domain}
                className="relative p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Domain header */}
                <div className="flex items-center gap-3 mb-3">
                  <DomainCategory domain={expertise.domain} size="sm" />
                </div>

                {/* Expertise level */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md ${levelConfig.bgColor}`}>
                    <Icon className={`w-4 h-4 ${levelConfig.color}`} />
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${levelConfig.color}`}>
                      {levelConfig.label}
                    </span>
                    <p className="text-xs text-gray-500">{levelConfig.description}</p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>已完成课程</span>
                    <span>{expertise.courseCount} 门</span>
                  </div>
                  
                  {/* Star rating visualization */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= Math.min(5, Math.ceil(expertise.courseCount / 2));
                      return isActive ? (
                        <StarIconSolid key={star} className={`w-4 h-4 ${levelConfig.color}`} />
                      ) : (
                        <StarIcon key={star} className="w-4 h-4 text-gray-300" />
                      );
                    })}
                  </div>
                </div>

                {/* Next level progress */}
                {expertise.level !== 'expert' && (
                  <div className="text-xs text-gray-500">
                    {(() => {
                      const nextLevel = expertise.level === 'novice' ? 'intermediate' : 
                                       expertise.level === 'intermediate' ? 'advanced' : 'expert';
                      const nextLevelConfig = expertiseLevels[nextLevel];
                      const coursesNeeded = nextLevelConfig.minCourses - expertise.courseCount;
                      
                      return coursesNeeded > 0 ? (
                        <span>再完成 {coursesNeeded} 门课程达到{nextLevelConfig.label}水平</span>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed breakdown */}
        {showDetails && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">详细分析</h4>
            
            {expertiseLevels_calculated.map((expertise) => {
              const levelConfig = expertiseLevels[expertise.level];
              const domainConfig = DOMAIN_CONFIG[expertise.domain];

              return (
                <div key={expertise.domain} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <DomainCategory domain={expertise.domain} size="sm" />
                      <span className={`text-sm font-medium ${levelConfig.color}`}>
                        {levelConfig.label}水平
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {expertise.courseCount} / {courses.filter(c => 
                        DomainDetector.detectCourseDomains(c).includes(expertise.domain)
                      ).length} 门课程
                    </span>
                  </div>

                  {/* Completed courses */}
                  {expertise.courses.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">已完成课程：</p>
                      <div className="flex flex-wrap gap-2">
                        {expertise.courses.slice(0, 3).map((course) => (
                          <span
                            key={course.id}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 border border-gray-200"
                          >
                            {course.title}
                          </span>
                        ))}
                        {expertise.courses.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 border border-gray-200">
                            +{expertise.courses.length - 3} 门
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Domain-specific insights */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>该领域特色：</strong> {domainConfig.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {domainConfig.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Overall expertise summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">整体专业度概览</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">涉及领域：</span>
              <span className="font-medium text-gray-900 ml-1">
                {expertiseLevels_calculated.length} 个
              </span>
            </div>
            <div>
              <span className="text-gray-600">完成课程：</span>
              <span className="font-medium text-gray-900 ml-1">
                {completedCourseIds.length} 门
              </span>
            </div>
            <div>
              <span className="text-gray-600">高级领域：</span>
              <span className="font-medium text-gray-900 ml-1">
                {expertiseLevels_calculated.filter(e => e.level === 'advanced' || e.level === 'expert').length} 个
              </span>
            </div>
            <div>
              <span className="text-gray-600">专家领域：</span>
              <span className="font-medium text-gray-900 ml-1">
                {expertiseLevels_calculated.filter(e => e.level === 'expert').length} 个
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}