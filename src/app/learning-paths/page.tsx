import { loadLearningPaths } from '@/lib/data';
import { LearningPathCard } from '@/components/course/LearningPathCard';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Learning Paths - ABMind Course Portal',
  description: 'Structured learning paths for Agent-Based Modeling, from beginner to advanced levels',
};

export default async function LearningPathsPage() {
  const learningPaths = await loadLearningPaths();

  // Calculate statistics
  const totalSteps = learningPaths.reduce((sum, path) => sum + path.steps.length, 0);
  const avgDuration = learningPaths.length > 0 
    ? Math.round(learningPaths.reduce((sum, path) => {
        const weeks = parseInt(path.estimated_duration.match(/\d+/)?.[0] || '0');
        return sum + weeks;
      }, 0) / learningPaths.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            学习路径
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            根据不同的学习目标和背景，我们为您精心设计了多条结构化的学习路径。
            从零基础入门到专业应用，找到最适合您的学习方案。
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{learningPaths.length}</div>
              <div className="text-sm text-gray-600">学习路径</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{totalSteps}</div>
              <div className="text-sm text-gray-600">学习步骤</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{avgDuration}周</div>
              <div className="text-sm text-gray-600">平均时长</div>
            </div>
          </div>
        </div>

        {/* How Learning Paths Work */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            学习路径如何工作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. 选择适合的路径
              </h3>
              <p className="text-gray-600">
                根据您的背景和目标，选择最适合的学习路径。每条路径都有明确的受众定位和学习目标。
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. 按步骤学习
              </h3>
              <p className="text-gray-600">
                按照设计好的顺序学习课程、阅读资源和完成实践项目。每个步骤都为下一步做好准备。
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. 达成学习目标
              </h3>
              <p className="text-gray-600">
                完成路径后，您将具备相应领域的知识和技能，能够独立进行 ABM 建模和研究。
              </p>
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            选择您的学习路径
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <div key={path.id} className="relative">
                <LearningPathCard learningPath={path} />
                
                {/* Path-specific recommendations */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">推荐给：</h4>
                  <p className="text-sm text-blue-700">{path.recommended_audience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Details */}
        <div className="space-y-8">
          {learningPaths.map((path, index) => (
            <div key={path.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {path.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{path.estimated_duration}</span>
                      </div>
                      <div className="flex items-center">
                        <AcademicCapIcon className="w-4 h-4 mr-1" />
                        <span>{path.steps.length} 个步骤</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Learning Steps */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">学习步骤：</h4>
                  <div className="space-y-4">
                    {path.steps.map((step, stepIndex) => {
                      const isLastStep = stepIndex === path.steps.length - 1;
                      
                      return (
                        <div key={step.order} className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">{step.order}</span>
                            </div>
                            {!isLastStep && (
                              <div className="w-px h-6 bg-gray-300 ml-4 mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                step.type === 'course' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : step.type === 'resource'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {step.type === 'course' ? '课程' : step.type === 'resource' ? '资源' : '实践'}
                              </span>
                              {step.optional && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  可选
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700">{step.note}</p>
                            
                            {/* Link to course if available */}
                            {step.course_id && (
                              <Link
                                href={`/courses/${step.course_id}`}
                                className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                查看课程详情
                                <ArrowRightIcon className="w-3 h-3 ml-1" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Start Learning Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      适合人群：{path.recommended_audience}
                    </div>
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      开始学习
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              还没找到合适的学习路径？
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              浏览我们的完整课程库，或者联系社区获取个性化的学习建议
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                浏览所有课程
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-3 border-2 border-blue-300 text-lg font-medium rounded-md text-blue-100 hover:bg-blue-500 hover:text-white transition-colors"
              >
                联系社区
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}