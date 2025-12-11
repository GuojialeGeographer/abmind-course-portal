'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Course, Resource, Domain, DomainInfo } from '@/types';
import { CourseCard } from '@/components/course/CourseCard';
import { ResourceCard } from '@/components/course/ResourceCard';
import { DomainCategory } from '@/components/course/DomainCategory';

interface DomainPageClientProps {
  domain: Domain;
  domainConfig: DomainInfo;
  courses: Course[];
  resources: Resource[];
  relationships: Array<{
    course: Course;
    domains: Domain[];
    relatedCourses: Array<{ course: Course; sharedDomains: Domain[] }>;
  }>;
  tools: string[];
  methodologies: string[];
  learningSequence: Array<{
    phase: string;
    description: string;
    courses: Course[];
    domains: Domain[];
  }>;
}

export function DomainPageClient({
  domain,
  domainConfig,
  courses,
  resources,
  relationships,
  tools,
  methodologies,
  learningSequence
}: DomainPageClientProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'resources' | 'learning'>('courses');

  const Icon = {
    urban: AcademicCapIcon,
    environmental: BeakerIcon,
    transportation: WrenchScrewdriverIcon,
    social: ChartBarIcon,
    economics: BookOpenIcon,
    computational: BeakerIcon
  }[domain] || AcademicCapIcon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <Icon className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{domainConfig.label}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {domainConfig.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{courses.length} 门课程</span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{resources.length} 个资源</span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{tools.length} 个工具</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'courses', label: '相关课程', count: courses.length },
              { id: 'resources', label: '学习资源', count: resources.length },
              { id: 'learning', label: '学习路径', count: learningSequence.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Domain-specific Tools and Methodologies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tools */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">常用工具</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Methodologies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <BeakerIcon className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold">核心方法</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {methodologies.map((methodology) => (
                <span
                  key={methodology}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {methodology}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">相关课程</h2>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} showTags />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关课程</h3>
                <p className="text-gray-500 mb-4">该领域的课程正在筹备中</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  浏览所有课程
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">学习资源</h2>
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关资源</h3>
                <p className="text-gray-500 mb-4">该领域的资源正在整理中</p>
                <Link
                  href="/resources"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  浏览所有资源
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">推荐学习路径</h2>
            {learningSequence.length > 0 ? (
              <div className="space-y-8">
                {learningSequence.map((phase, index) => (
                  <div key={phase.phase} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{phase.phase}</h3>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>
                    </div>
                    
                    {/* Domain indicators */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {phase.domains.map((phaseDomain) => (
                          <DomainCategory
                            key={phaseDomain}
                            domain={phaseDomain}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Courses in this phase */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.courses.map((course) => (
                        <CourseCard key={course.id} course={course} compact />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无学习路径</h3>
                <p className="text-gray-500 mb-4">该领域的学习路径正在设计中</p>
                <Link
                  href="/learning-paths"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  查看通用学习路径
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Cross-domain Relationships */}
        {relationships.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">跨领域关联</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 mb-4">
                以下课程涉及多个领域，展现了{domainConfig.label}与其他领域的交叉应用：
              </p>
              <div className="space-y-4">
                {relationships.slice(0, 3).map((relationship) => (
                  <div key={relationship.course.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-lg mb-2">
                      <Link 
                        href={`/courses/${relationship.course.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {relationship.course.title}
                      </Link>
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {relationship.domains.map((relDomain) => (
                        <DomainCategory
                          key={relDomain}
                          domain={relDomain}
                          size="sm"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">
                      与 {relationship.relatedCourses.length} 门相关课程有交集
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}