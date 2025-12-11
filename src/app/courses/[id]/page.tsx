import { loadCourse, loadCourses } from '@/lib/data';
import { SessionList } from '@/components/course/SessionList';
import { LinkComponent } from '@/components/course/LinkComponent';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { generateCourseMetadata, generateCourseStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  ClockIcon,
  TagIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface CourseDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const courses = await loadCourses();
  return courses.map((course) => ({
    id: course.id,
  }));
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const course = await loadCourse(params.id);
  
  if (!course) {
    return {
      title: 'Course Not Found - ABMind Course Portal',
    };
  }

  return generateCourseMetadata(course);
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

const difficultyLabels = {
  beginner: '入门',
  intermediate: '中级',
  advanced: '高级',
};

const typeLabels = {
  course: '课程',
  workshop: '工作坊',
  reading_group: '读书会',
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const course = await loadCourse(params.id);

  if (!course) {
    notFound();
  }

  // Get related courses (same tags or difficulty)
  const allCourses = await loadCourses();
  const relatedCourses = allCourses
    .filter(c => c.id !== course.id)
    .filter(c => 
      c.difficulty === course.difficulty || 
      c.tags.some(tag => course.tags.includes(tag))
    )
    .slice(0, 3);

  // Generate structured data
  const courseStructuredData = generateCourseStructuredData(course);
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: '首页', url: 'https://abmind.org' },
    { name: '课程', url: 'https://abmind.org/courses' },
    { name: course.title, url: `https://abmind.org/courses/${course.id}` },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">首页</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-gray-700">课程</Link>
          <span>/</span>
          <span className="text-gray-900">{course.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/courses"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            返回课程列表
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[course.difficulty]}`}>
                      {difficultyLabels[course.difficulty]}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {typeLabels[course.type]}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {course.year}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {course.language === 'zh' ? '中文' : 'English'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {course.summary}
              </p>

              {/* Course Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <UserGroupIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">讲师</div>
                    <div className="text-sm text-gray-600">{course.instructors.join(', ')}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">课程数量</div>
                    <div className="text-sm text-gray-600">{course.sessions.length} 节课</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">最后更新</div>
                    <div className="text-sm text-gray-600">
                      {new Date(course.last_updated).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <TagIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">标签</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Sessions */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                课程内容
              </h2>
              <SessionList sessions={course.sessions} />
            </div>

            {/* External Links */}
            {(course.external_links.course_page || course.external_links.materials_repo) && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  相关链接
                </h2>
                <div className="space-y-4">
                  {course.external_links.course_page && (
                    <LinkComponent
                      href={course.external_links.course_page}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                      课程主页
                    </LinkComponent>
                  )}
                  {course.external_links.materials_repo && (
                    <LinkComponent
                      href={course.external_links.materials_repo}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                      课程资料仓库
                    </LinkComponent>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                快速操作
              </h3>
              <div className="space-y-3">
                <Link
                  href="/learning-paths"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  查看学习路径
                </Link>
                <Link
                  href="/courses"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  浏览更多课程
                </Link>
              </div>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  相关课程
                </h3>
                <div className="space-y-4">
                  {relatedCourses.map((relatedCourse) => (
                    <Link
                      key={relatedCourse.id}
                      href={`/courses/${relatedCourse.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {relatedCourse.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded text-xs ${difficultyColors[relatedCourse.difficulty]}`}>
                          {difficultyLabels[relatedCourse.difficulty]}
                        </span>
                        <span>{relatedCourse.year}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Course Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                课程标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/courses?tags=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}