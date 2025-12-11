import { loadCourses, loadResources, loadLearningPaths } from '@/lib/data';
import CoursesPageClient from './CoursesPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses - ABMind Course Portal',
  description: 'Browse all Agent-Based Modeling courses and workshops from the ABMind community',
};

export default async function CoursesPage() {
  const [courses, resources, learningPaths] = await Promise.all([
    loadCourses(),
    loadResources(),
    loadLearningPaths()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            课程列表
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            浏览 ABMind 社区提供的所有 Agent-Based Modeling 课程和工作坊。
            使用筛选器和搜索功能找到最适合您学习需求的内容。
          </p>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{courses.length}</div>
            <div className="text-sm text-gray-600">总课程数</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {courses.filter(c => c.difficulty === 'beginner').length}
            </div>
            <div className="text-sm text-gray-600">入门课程</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {courses.filter(c => c.difficulty === 'intermediate').length}
            </div>
            <div className="text-sm text-gray-600">中级课程</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {courses.filter(c => c.difficulty === 'advanced').length}
            </div>
            <div className="text-sm text-gray-600">高级课程</div>
          </div>
        </div>

        {/* Main Content */}
        <CoursesPageClient 
          courses={courses}
          resources={resources}
          learningPaths={learningPaths}
        />
      </div>
    </div>
  );
}