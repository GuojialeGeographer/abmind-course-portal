'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRightIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Course, Domain } from '@/types';
import { DomainCategory } from './DomainCategory';
import { DomainDetector } from '@/lib/domains';

interface PrerequisiteNode {
  course: Course;
  domains: Domain[];
  level: number;
  isCompleted?: boolean;
  isRecommended?: boolean;
}

interface PrerequisiteChainProps {
  targetCourse: Course;
  allCourses: Course[];
  completedCourseIds?: string[];
  maxDepth?: number;
  showDomains?: boolean;
}

export function PrerequisiteChain({
  targetCourse,
  allCourses,
  completedCourseIds = [],
  maxDepth = 3,
  showDomains = true
}: PrerequisiteChainProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Build prerequisite chain based on difficulty and domains
  const buildPrerequisiteChain = (course: Course, currentLevel: number = 0): PrerequisiteNode[] => {
    if (currentLevel >= maxDepth) return [];

    const courseDomains = DomainDetector.detectCourseDomains(course);
    const chain: PrerequisiteNode[] = [];

    // Find prerequisite courses (same domains, lower difficulty, earlier year)
    const prerequisites = allCourses.filter(otherCourse => {
      if (otherCourse.id === course.id) return false;
      
      const otherDomains = DomainDetector.detectCourseDomains(otherCourse);
      const hasSharedDomain = courseDomains.some(domain => otherDomains.includes(domain));
      
      if (!hasSharedDomain) return false;

      // Check if it's a logical prerequisite
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      const isEasier = difficultyOrder[otherCourse.difficulty] < difficultyOrder[course.difficulty];
      const isEarlier = otherCourse.year <= course.year;
      
      return isEasier || (otherCourse.difficulty === course.difficulty && isEarlier && otherCourse.year < course.year);
    });

    // Sort prerequisites by relevance (shared domains, difficulty, year)
    prerequisites.sort((a, b) => {
      const aSharedDomains = DomainDetector.detectCourseDomains(a).filter(d => courseDomains.includes(d)).length;
      const bSharedDomains = DomainDetector.detectCourseDomains(b).filter(d => courseDomains.includes(d)).length;
      
      if (aSharedDomains !== bSharedDomains) {
        return bSharedDomains - aSharedDomains; // More shared domains first
      }
      
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      if (a.difficulty !== b.difficulty) {
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]; // Higher difficulty first
      }
      
      return b.year - a.year; // More recent first
    });

    // Add top prerequisites to chain
    prerequisites.slice(0, 2).forEach(prereq => {
      const prereqDomains = DomainDetector.detectCourseDomains(prereq);
      chain.push({
        course: prereq,
        domains: prereqDomains,
        level: currentLevel,
        isCompleted: completedCourseIds.includes(prereq.id),
        isRecommended: true
      });

      // Recursively build chain for prerequisites
      if (currentLevel < maxDepth - 1) {
        chain.push(...buildPrerequisiteChain(prereq, currentLevel + 1));
      }
    });

    return chain;
  };

  const toggleExpanded = (courseId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedNodes(newExpanded);
  };

  const targetDomains = DomainDetector.detectCourseDomains(targetCourse);
  const prerequisiteChain = buildPrerequisiteChain(targetCourse);
  
  // Group by level for better visualization
  const chainByLevel = prerequisiteChain.reduce((acc, node) => {
    if (!acc[node.level]) acc[node.level] = [];
    acc[node.level]!.push(node);
    return acc;
  }, {} as Record<number, PrerequisiteNode[]>);

  if (prerequisiteChain.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AcademicCapIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">学习路径</h3>
        </div>
        <div className="text-center py-8">
          <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">这门课程可以直接开始学习，无需特定前置课程。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <AcademicCapIcon className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">推荐学习路径</h3>
      </div>

      <div className="space-y-6">
        {/* Target course domains */}
        {showDomains && targetDomains.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">目标课程涉及领域：</h4>
            <div className="flex flex-wrap gap-2">
              {targetDomains.map(domain => (
                <DomainCategory key={domain} domain={domain} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* Prerequisite chain visualization */}
        <div className="space-y-4">
          {Object.entries(chainByLevel)
            .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Reverse order (deepest first)
            .map(([level, nodes]) => (
              <div key={level} className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    {parseInt(level) + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {parseInt(level) === 0 ? '推荐前置课程' : `第 ${parseInt(level) + 1} 层前置`}
                  </span>
                </div>

                <div className="ml-8 space-y-3">
                  {nodes.map((node, index) => (
                    <div key={node.course.id} className="relative">
                      {/* Connection line */}
                      {index < nodes.length - 1 && (
                        <div className="absolute left-4 top-12 w-px h-8 bg-gray-200" />
                      )}

                      <div className={`
                        flex items-start gap-3 p-4 rounded-lg border transition-all
                        ${node.isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : node.isRecommended 
                            ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }
                      `}>
                        {/* Status icon */}
                        <div className="flex-shrink-0 mt-1">
                          {node.isCompleted ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : node.isRecommended ? (
                            <ClockIcon className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/courses/${node.course.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                              >
                                {node.course.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`
                                  inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                  ${node.course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                    node.course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'}
                                `}>
                                  {node.course.difficulty}
                                </span>
                                <span className="text-xs text-gray-500">{node.course.year} 年</span>
                                <span className="text-xs text-gray-500">{node.course.type}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleExpanded(node.course.id)}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <ChevronRightIcon 
                                className={`w-4 h-4 transition-transform ${
                                  expandedNodes.has(node.course.id) ? 'rotate-90' : ''
                                }`} 
                              />
                            </button>
                          </div>

                          {/* Expanded details */}
                          {expandedNodes.has(node.course.id) && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {node.course.summary}
                              </p>
                              
                              {showDomains && node.domains.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {node.domains.map(domain => (
                                    <DomainCategory key={domain} domain={domain} size="sm" />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arrow to next level */}
                {parseInt(level) > 0 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-8 h-px bg-gray-300" />
                      <ChevronRightIcon className="w-4 h-4 rotate-90" />
                      <div className="w-8 h-px bg-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Target course */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                ★
              </div>
              <span className="text-sm font-medium text-gray-700">目标课程</span>
            </div>

            <div className="ml-8">
              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                <AcademicCapIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{targetCourse.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                      ${targetCourse.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        targetCourse.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {targetCourse.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{targetCourse.year} 年</span>
                    <span className="text-xs text-gray-500">{targetCourse.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning path summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">学习路径总结</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">推荐前置课程：</span>
              <span className="font-medium text-gray-900 ml-1">
                {prerequisiteChain.filter(n => n.isRecommended).length} 门
              </span>
            </div>
            <div>
              <span className="text-gray-600">涉及领域：</span>
              <span className="font-medium text-gray-900 ml-1">
                {new Set(prerequisiteChain.flatMap(n => n.domains).concat(targetDomains)).size} 个
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}