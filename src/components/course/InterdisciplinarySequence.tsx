'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapIcon,
  ChevronRightIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Course, Domain } from '@/types';
import { DomainDetector, DOMAIN_CONFIG, getDomainSpecificInfo } from '@/lib/domains';
import { DomainCategory } from './DomainCategory';

interface LearningSequence {
  id: string;
  title: string;
  description: string;
  targetDomains: Domain[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phases: LearningPhase[];
  totalCourses: number;
}

interface LearningPhase {
  id: string;
  title: string;
  description: string;
  domains: Domain[];
  courses: Course[];
  duration: string;
  isOptional?: boolean;
}

interface InterdisciplinarySequenceProps {
  courses: Course[];
  targetDomains?: Domain[];
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  completedCourseIds?: string[];
}

export function InterdisciplinarySequence({
  courses,
  targetDomains = [],
  userLevel: _userLevel = 'beginner',
  completedCourseIds = []
}: InterdisciplinarySequenceProps) {
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);

  // Generate interdisciplinary learning sequences
  const generateSequences = (): LearningSequence[] => {
    const sequences: LearningSequence[] = [];

    // Common interdisciplinary combinations
    const combinations = [
      {
        id: 'urban-transport',
        title: '城市交通系统建模',
        description: '结合城市规划和交通建模，学习如何构建完整的城市交通系统模型',
        domains: ['urban', 'transportation'] as Domain[],
        difficulty: 'intermediate' as const
      },
      {
        id: 'urban-environment',
        title: '可持续城市发展',
        description: '融合城市建模和环境科学，探索可持续城市发展的建模方法',
        domains: ['urban', 'environmental'] as Domain[],
        difficulty: 'advanced' as const
      },
      {
        id: 'social-economics',
        title: '社会经济系统分析',
        description: '结合社会网络分析和经济建模，理解复杂社会经济现象',
        domains: ['social', 'economics'] as Domain[],
        difficulty: 'intermediate' as const
      },
      {
        id: 'transport-environment',
        title: '绿色交通与环境影响',
        description: '研究交通系统对环境的影响，设计环保的交通解决方案',
        domains: ['transportation', 'environmental'] as Domain[],
        difficulty: 'advanced' as const
      },
      {
        id: 'computational-all',
        title: '计算建模方法论',
        description: '掌握跨领域的计算建模技术和优化方法',
        domains: ['computational', 'urban', 'social'] as Domain[],
        difficulty: 'advanced' as const
      }
    ];

    combinations.forEach(combo => {
      // Filter courses relevant to this combination
      const relevantCourses = courses.filter(course => {
        const courseDomains = DomainDetector.detectCourseDomains(course);
        return combo.domains.some(domain => courseDomains.includes(domain));
      });

      if (relevantCourses.length < 3) return; // Need at least 3 courses for a sequence

      // Generate phases for this sequence
      const phases = generatePhases(combo.domains, relevantCourses, combo.difficulty);
      
      if (phases.length > 0) {
        sequences.push({
          id: combo.id,
          title: combo.title,
          description: combo.description,
          targetDomains: combo.domains,
          estimatedDuration: calculateDuration(phases),
          difficulty: combo.difficulty,
          phases,
          totalCourses: phases.reduce((sum, phase) => sum + phase.courses.length, 0)
        });
      }
    });

    return sequences;
  };

  const generatePhases = (domains: Domain[], courses: Course[], targetDifficulty: string): LearningPhase[] => {
    const phases: LearningPhase[] = [];

    // Phase 1: Foundation (beginner courses in any domain)
    const foundationCourses = courses.filter(course => 
      course.difficulty === 'beginner'
    ).slice(0, 2);

    if (foundationCourses.length > 0) {
      phases.push({
        id: 'foundation',
        title: '基础阶段',
        description: 'ABM基础概念和编程技能',
        domains: ['computational'],
        courses: foundationCourses,
        duration: '4-6 周'
      });
    }

    // Phase 2: Domain-specific courses
    domains.forEach((domain) => {
      const domainCourses = courses.filter(course => {
        const courseDomains = DomainDetector.detectCourseDomains(course);
        return courseDomains.includes(domain) && 
               (course.difficulty === 'intermediate' || 
                (targetDifficulty === 'beginner' && course.difficulty === 'beginner'));
      }).slice(0, 2);

      if (domainCourses.length > 0) {
        const domainConfig = DOMAIN_CONFIG[domain];
        phases.push({
          id: `domain-${domain}`,
          title: `${domainConfig.label}专业课程`,
          description: `深入学习${domainConfig.label}的理论和实践`,
          domains: [domain],
          courses: domainCourses,
          duration: '6-8 周'
        });
      }
    });

    // Phase 3: Integration (advanced courses spanning multiple domains)
    const integrationCourses = courses.filter(course => {
      const courseDomains = DomainDetector.detectCourseDomains(course);
      return course.difficulty === 'advanced' && 
             domains.filter(domain => courseDomains.includes(domain)).length >= 2;
    }).slice(0, 2);

    if (integrationCourses.length > 0) {
      phases.push({
        id: 'integration',
        title: '综合应用',
        description: '跨领域项目和高级应用',
        domains: domains,
        courses: integrationCourses,
        duration: '8-10 周'
      });
    }

    return phases;
  };

  const calculateDuration = (phases: LearningPhase[]): string => {
    const totalWeeks = phases.reduce((sum, phase) => {
      const parts = phase.duration.split('-');
      const weeks = parseInt(parts[1] || parts[0] || '4');
      return sum + weeks;
    }, 0);
    
    return `${Math.floor(totalWeeks / 4)}-${Math.ceil(totalWeeks / 4)} 个月`;
  };

  const sequences = generateSequences();

  // Filter sequences based on target domains if specified
  const filteredSequences = targetDomains.length > 0 
    ? sequences.filter(seq => 
        targetDomains.some(domain => seq.targetDomains.includes(domain))
      )
    : sequences;

  if (filteredSequences.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">跨领域学习路径</h3>
        </div>
        <div className="text-center py-8">
          <ArrowPathIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">暂无适合的跨领域学习路径，请尝试选择其他领域组合。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapIcon className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">跨领域学习路径</h3>
      </div>

      <div className="space-y-6">
        {/* Sequence selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSequences.map((sequence) => (
            <div
              key={sequence.id}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all
                ${selectedSequence === sequence.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              onClick={() => setSelectedSequence(
                selectedSequence === sequence.id ? null : sequence.id
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">{sequence.title}</h4>
                <ChevronRightIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    selectedSequence === sequence.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {sequence.description}
              </p>

              {/* Domains */}
              <div className="flex flex-wrap gap-1 mb-3">
                {sequence.targetDomains.map(domain => (
                  <DomainCategory key={domain} domain={domain} size="sm" />
                ))}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {sequence.estimatedDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <AcademicCapIcon className="w-3 h-3" />
                    {sequence.totalCourses} 门课程
                  </span>
                </div>
                <span className={`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${sequence.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    sequence.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}
                `}>
                  {sequence.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed sequence view */}
        {selectedSequence && (
          <div className="bg-gray-50 rounded-lg p-6">
            {(() => {
              const sequence = filteredSequences.find(s => s.id === selectedSequence);
              if (!sequence) return null;

              return (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {sequence.title}
                    </h4>
                    <p className="text-gray-600 mb-4">{sequence.description}</p>
                    
                    {/* Sequence metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">预计时长：</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {sequence.estimatedDuration}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">课程总数：</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {sequence.totalCourses} 门
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">难度等级：</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {sequence.difficulty}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">涉及领域：</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {sequence.targetDomains.length} 个
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Learning phases */}
                  <div className="space-y-4">
                    <h5 className="text-md font-medium text-gray-900">学习阶段</h5>
                    
                    {sequence.phases.map((phase, index) => (
                      <div key={phase.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="text-sm font-medium text-gray-900">
                                {phase.title}
                              </h6>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ClockIcon className="w-3 h-3" />
                                {phase.duration}
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-3">
                              {phase.description}
                            </p>

                            {/* Phase domains */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {phase.domains.map(domain => (
                                <DomainCategory key={domain} domain={domain} size="sm" />
                              ))}
                            </div>

                            {/* Phase courses */}
                            <div className="space-y-2">
                              {phase.courses.map(course => {
                                const isCompleted = completedCourseIds.includes(course.id);
                                
                                return (
                                  <div
                                    key={course.id}
                                    className={`
                                      flex items-center gap-2 p-2 rounded text-xs
                                      ${isCompleted 
                                        ? 'bg-green-50 text-green-800' 
                                        : 'bg-gray-50 text-gray-700'
                                      }
                                    `}
                                  >
                                    <div className={`
                                      w-2 h-2 rounded-full flex-shrink-0
                                      ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                                    `} />
                                    <Link
                                      href={`/courses/${course.id}`}
                                      className="flex-1 hover:underline"
                                    >
                                      {course.title}
                                    </Link>
                                    <span className={`
                                      px-1.5 py-0.5 rounded text-xs
                                      ${course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                        course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'}
                                    `}>
                                      {course.difficulty}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tools and methodologies */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">
                      学习路径涉及的工具和方法
                    </h5>
                    
                    {(() => {
                      const { tools, methodologies } = getDomainSpecificInfo(sequence.targetDomains);
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="text-xs font-medium text-gray-700 mb-2">常用工具</h6>
                            <div className="flex flex-wrap gap-1">
                              {tools.slice(0, 6).map(tool => (
                                <span
                                  key={tool}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 border border-gray-200"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-xs font-medium text-gray-700 mb-2">核心方法</h6>
                            <div className="flex flex-wrap gap-1">
                              {methodologies.slice(0, 4).map(methodology => (
                                <span
                                  key={methodology}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 border border-gray-200"
                                >
                                  {methodology}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}