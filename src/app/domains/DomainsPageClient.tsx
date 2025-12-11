'use client';

import Link from 'next/link';
import { 
  BuildingOffice2Icon,
  GlobeAltIcon,
  TruckIcon,
  BeakerIcon,
  ChartBarIcon,
  CpuChipIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { DOMAIN_CONFIG } from '@/lib/domains';
import { Domain, Course } from '@/types';
import { DomainCategory } from '@/components/course/DomainCategory';

interface DomainsPageClientProps {
  domainStats: Record<Domain, { courses: number; resources: number; total: number }>;
  relationships: Array<{
    course: Course;
    domains: Domain[];
    relatedCourses: Array<{ course: Course; sharedDomains: Domain[] }>;
  }>;
  totalCourses: number;
  totalResources: number;
}

export function DomainsPageClient({
  domainStats,
  relationships,
  totalCourses,
  totalResources
}: DomainsPageClientProps) {
  const domainIcons = {
    urban: BuildingOffice2Icon,
    environmental: GlobeAltIcon,
    transportation: TruckIcon,
    social: ChartBarIcon,
    economics: BeakerIcon,
    computational: CpuChipIcon
  };

  // Get interdisciplinary courses (courses that span multiple domains)
  const interdisciplinaryCourses = relationships.filter(rel => rel.domains.length > 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">ABM应用领域</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              探索Agent-Based Modeling在不同领域的应用，从城市规划到环境保护，从交通系统到社会网络
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{Object.keys(DOMAIN_CONFIG).length} 个应用领域</span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{totalCourses} 门相关课程</span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">{totalResources} 个学习资源</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Domain Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">选择您感兴趣的领域</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(DOMAIN_CONFIG).map(([domainId, config]) => {
              const domain = domainId as Domain;
              const Icon = domainIcons[domain];
              const stats = domainStats[domain];

              return (
                <Link
                  key={domain}
                  href={`/domains/${domain}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {config.label}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {config.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{stats.courses} 课程</span>
                      <span>{stats.resources} 资源</span>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>

                  {/* Tools preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {config.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tool}
                        </span>
                      ))}
                      {config.tools.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          +{config.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Interdisciplinary Section */}
        {interdisciplinaryCourses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">跨领域课程</h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              这些课程融合了多个领域的知识，展现了ABM在复杂系统建模中的强大能力
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {interdisciplinaryCourses.slice(0, 4).map((relationship) => (
                <div key={relationship.course.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">
                    <Link 
                      href={`/courses/${relationship.course.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {relationship.course.title}
                    </Link>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {relationship.domains.map((domain) => (
                      <DomainCategory
                        key={domain}
                        domain={domain}
                        size="sm"
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {relationship.course.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{relationship.course.difficulty} 难度</span>
                    <span>{relationship.course.year} 年</span>
                  </div>
                </div>
              ))}
            </div>

            {interdisciplinaryCourses.length > 4 && (
              <div className="text-center mt-8">
                <Link
                  href="/courses?domains=multiple"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  查看更多跨领域课程
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Domain Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">领域分布统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(domainStats).map(([domainId, stats]) => {
              const domain = domainId as Domain;
              
              return (
                <div key={domain} className="text-center">
                  <DomainCategory
                    domain={domain}
                    count={stats.total}
                    size="sm"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    <div>{stats.courses} 课程</div>
                    <div>{stats.resources} 资源</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}