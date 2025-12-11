import { loadSiteConfig, loadCourses, loadLearningPaths } from '@/lib/data';
import { CourseCard } from '@/components/course/CourseCard';
import { LearningPathCard } from '@/components/course/LearningPathCard';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default async function Home() {
  const [siteConfig, courses, learningPaths] = await Promise.all([
    loadSiteConfig(),
    loadCourses(),
    loadLearningPaths()
  ]);

  // Get featured courses based on site config
  const featuredCourses = courses.filter(course => 
    siteConfig.featured_courses.includes(course.id)
  ).slice(0, 3);

  // Get recent courses (latest 3)
  const recentCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <SparklesIcon className="w-4 h-4" />
                <span>ABMind 中文学习社区</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Agent-Based Modeling</span>
              <span className="block text-blue-600">系统化学习平台</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              专为中文社区打造的 ABM 和 Mesa 框架学习资源平台。
              从基础概念到高级应用，提供结构化的学习路径，
              专注于地理、城市和环境仿真建模。
            </p>

            {/* Quick Access Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/learning-paths"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                从零开始学习 ABM
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                浏览所有课程
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{courses.length}+</div>
                <div className="text-gray-600">精品课程</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{learningPaths.length}</div>
                <div className="text-gray-600">学习路径</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">社区成员</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Learning Paths */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              推荐学习路径
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              根据不同背景和目标，我们为您精心设计了多条学习路径
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.slice(0, 3).map((path) => (
              <LearningPathCard key={path.id} learningPath={path} compact />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/learning-paths"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              查看所有学习路径
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              精选课程
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              社区推荐的高质量课程，涵盖从入门到进阶的各个层次
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredCourses.length > 0 ? featuredCourses : recentCourses).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              查看所有课程
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Updates and Community Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Updates */}
            <div>
              <div className="flex items-center mb-6">
                <ClockIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  最新动态
                </h2>
              </div>
              
              <div className="space-y-4">
                {siteConfig.announcements.slice(0, 3).map((announcement, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        announcement.type === 'success' 
                          ? 'bg-green-100 text-green-800'
                          : announcement.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {announcement.type === 'success' ? '新增' : 
                         announcement.type === 'warning' ? '重要' : '通知'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(announcement.date).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Highlights */}
            <div>
              <div className="flex items-center mb-6">
                <UserGroupIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  社区亮点
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🎯 专注实用性
                  </h3>
                  <p className="text-gray-600 text-sm">
                    所有课程都结合实际案例，从城市规划到环境建模，
                    帮助您将理论知识转化为实践能力。
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🌟 中文友好
                  </h3>
                  <p className="text-gray-600 text-sm">
                    专为中文用户优化的学习体验，包含中文讲解、
                    本土化案例和活跃的中文社区支持。
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🚀 持续更新
                  </h3>
                  <p className="text-gray-600 text-sm">
                    紧跟 ABM 和 Mesa 框架的最新发展，
                    定期更新课程内容和添加新的学习资源。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备开始您的 ABM 学习之旅了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            加入我们的社区，与志同道合的学习者一起探索复杂系统建模的奥秘
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learning-paths"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              选择学习路径
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              了解社区
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
