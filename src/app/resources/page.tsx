import { loadResources, loadCourses, loadLearningPaths } from '@/lib/data';
import ResourcesPageClient from './ResourcesPageClient';
import { Metadata } from 'next';
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  CircleStackIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Resources - ABMind Course Portal',
  description: 'Comprehensive library of Agent-Based Modeling resources including documentation, papers, tools, and datasets',
};

const typeIcons = {
  docs: DocumentTextIcon,
  tutorial: AcademicCapIcon,
  paper: NewspaperIcon,
  book: BookOpenIcon,
  dataset: CircleStackIcon,
  tool: WrenchScrewdriverIcon,
};

const typeLabels = {
  docs: '文档',
  tutorial: '教程',
  paper: '论文',
  book: '书籍',
  dataset: '数据集',
  tool: '工具',
};

const typeColors = {
  docs: 'bg-blue-100 text-blue-800 border-blue-200',
  tutorial: 'bg-green-100 text-green-800 border-green-200',
  paper: 'bg-purple-100 text-purple-800 border-purple-200',
  book: 'bg-orange-100 text-orange-800 border-orange-200',
  dataset: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  tool: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default async function ResourcesPage() {
  const [resources, courses, learningPaths] = await Promise.all([
    loadResources(),
    loadCourses(),
    loadLearningPaths()
  ]);

  // Calculate statistics
  const resourcesByType = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resourcesByLanguage = resources.reduce((acc, resource) => {
    acc[resource.language] = (acc[resource.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            资源库
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            精心收集的 Agent-Based Modeling 学习资源，包括官方文档、学术论文、
            实用工具和开放数据集。助您深入掌握 ABM 理论与实践。
          </p>
        </div>

        {/* Resource Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = resourcesByType[type] || 0;
            const Icon = typeIcons[type as keyof typeof typeIcons];
            
            return (
              <div key={type} className="bg-white rounded-lg shadow p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[type as keyof typeof typeColors]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            );
          })}
        </div>

        {/* Resource Categories Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            资源分类
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <DocumentTextIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">官方文档</h3>
              <p className="text-gray-600 text-sm">
                Mesa、NetLogo 等主流 ABM 框架的官方文档和 API 参考
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <AcademicCapIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">教程指南</h3>
              <p className="text-gray-600 text-sm">
                从入门到进阶的实用教程，涵盖建模技巧和最佳实践
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <NewspaperIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">学术论文</h3>
              <p className="text-gray-600 text-sm">
                ABM 理论基础、方法论和前沿研究的重要学术文献
              </p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <BookOpenIcon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">专业书籍</h3>
              <p className="text-gray-600 text-sm">
                复杂系统科学和智能体建模的经典教材和参考书
              </p>
            </div>
            
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <CircleStackIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">开放数据</h3>
              <p className="text-gray-600 text-sm">
                城市、社会、经济等领域的开放数据集，用于模型构建和验证
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <WrenchScrewdriverIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">开发工具</h3>
              <p className="text-gray-600 text-sm">
                建模框架、可视化工具和分析软件，提升开发效率
              </p>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">语言分布</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">
                中文资源: {resourcesByLanguage.zh || 0}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">
                英文资源: {resourcesByLanguage.en || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content with Filtering */}
        <ResourcesPageClient 
          resources={resources}
          courses={courses}
          learningPaths={learningPaths}
        />

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              发现更多学习资源
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              结合课程学习和实践项目，构建完整的 ABM 知识体系
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-green-600 transition-colors"
              >
                浏览课程
              </a>
              <a
                href="/learning-paths"
                className="inline-flex items-center px-8 py-3 border-2 border-green-300 text-lg font-medium rounded-md text-green-100 hover:bg-green-500 hover:text-white transition-colors"
              >
                学习路径
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}