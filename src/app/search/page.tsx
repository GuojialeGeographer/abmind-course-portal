import { Suspense } from 'react';
import { loadCourses, loadResources, loadLearningPaths } from '@/lib/data';
import SearchPageClient from './SearchPageClient';

export default async function SearchPage() {
  // Load all data for search
  const [courses, resources, learningPaths] = await Promise.all([
    loadCourses(),
    loadResources(),
    loadLearningPaths()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">搜索</h1>
          <p className="text-gray-600">搜索课程、资源和学习路径</p>
        </div>

        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        }>
          <SearchPageClient
            courses={courses}
            resources={resources}
            learningPaths={learningPaths}
          />
        </Suspense>
      </div>
    </div>
  );
}