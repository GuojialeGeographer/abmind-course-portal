import { loadSiteConfig } from '@/lib/data';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About - ABMind Course Portal',
  description: 'Learn about the ABMind Chinese community, our mission, values, and how to get involved in Agent-Based Modeling education',
};

export default async function AboutPage() {
  const siteConfig = await loadSiteConfig();

  const communityValues = [
    {
      icon: AcademicCapIcon,
      title: '知识共享',
      description: '我们相信知识应该开放共享。通过免费的课程和资源，让更多人能够接触和学习 ABM。',
      color: 'blue'
    },
    {
      icon: UserGroupIcon,
      title: '社区协作',
      description: '鼓励社区成员之间的交流合作，共同推进 ABM 在中文世界的发展和应用。',
      color: 'green'
    },
    {
      icon: LightBulbIcon,
      title: '创新实践',
      description: '将理论与实践相结合，鼓励创新思维，探索 ABM 在各个领域的应用可能。',
      color: 'purple'
    },
    {
      icon: GlobeAltIcon,
      title: '国际视野',
      description: '保持与国际 ABM 社区的联系，引入前沿理论和方法，促进学术交流。',
      color: 'indigo'
    }
  ];

  const organizers = [
    {
      name: 'Shuang Song',
      role: 'ABMind 社区联合创始人',
      affiliation: '马克思·普朗克研究所（地球人类学所）',
      expertise: 'Agent-Based Modeling、社会-生态系统建模、ABSESpy',
      description: '博士后研究员，从事社会-生态系统建模研究，有超6年的开发与开源社区经验。开发了多主体模型框架ABSESpy，领导PaperBell团队，担任DHTech软件审稿人。发表论文超20余篇（H-Index = 12）。',
      links: {
        homepage: 'https://www.gea.mpg.de/person/137764',
        github: 'https://github.com/SongshGeoLab',
        paperbell: 'https://paperbell.cn/'
      }
    },
    {
      name: 'Boyu Wang',
      role: 'ABMind 社区联合创始人 & Mesa 核心开发者',
      affiliation: '美国布法罗大学',
      expertise: 'Mesa Framework、Mesa-Geo、数据科学、软件工程',
      description: '博士生，前新加坡惠与（HPE）亚太创新中心数据科学家。Mesa团队核心开发成员，开源软件Mesa-Geo的主要开发者。Mesa GSoC 2024 & 2025导师，GSoC 2025 Mesa-LLM项目主要导师。',
      links: {
        homepage: 'https://wang-boyu.github.io',
        github: 'https://github.com/wang-boyu'
      }
    }
  ];

  const contributors = [
    {
      name: 'Xin Lin',
      role: '社区贡献者 & Mesa 维护者',
      affiliation: '中国地质大学（武汉）',
      expertise: 'Mesa Framework、社会-气候建模、强化学习',
      description: '硕士研究生，作为开源贡献者参与Mesa的代码维护。GISphere机构成员，参与GIS-info-LLM项目。',
      links: {
        github: 'https://github.com/peter-kinger'
      }
    },
    {
      name: 'Jiale Guo',
      role: '城市建模专家 & 社区运营',
      affiliation: '米兰理工大学',
      expertise: 'GeoAI、城市建模、空间分析',
      description: '硕士研究生，研究方向为GeoAI和可持续城市建模。参与GIS公益学术讲座（GISChat）的组织和运营工作。',
      links: {
        homepage: 'https://guojialegeographer.github.io/index.html',
        github: 'https://github.com/GuojialeGeographer'
      }
    },
    {
      name: 'Bo Hu',
      role: '社区运营 & 内容策划',
      affiliation: '南京大学社会学院',
      expertise: '环境社会学、社会模拟、气候变化',
      description: '博士研究生，关注社会模拟与气候变化问题。参与ABMind运营工作，已发表论文10余篇。',
      links: {
        homepage: 'https://hubo-home.com',
        github: 'https://github.com/brysonhu1202'
      }
    },
    {
      name: 'Adam Zhou',
      role: '空间建模专家',
      affiliation: '伦敦大学学院',
      expertise: '空间隔离建模、城市建模、计算社会科学',
      description: '博士生，致力于使用计算模型来分析和理解城市中的社会空间结构。',
      links: {
        github: 'https://github.com/AdamZh0u'
      }
    }
  ];

  const milestones = [
    {
      year: '2024',
      month: '初期',
      title: 'ABMind 社区构想',
      description: 'Shuang Song 和 Boyu Wang 基于对中文ABM教育资源缺乏的观察，开始构想建立中文ABM学习社区'
    },
    {
      year: '2024',
      month: '中期',
      title: 'Mesa 中文资源建设',
      description: '开始翻译和创建Mesa框架的中文学习资源，Boyu Wang作为Mesa核心开发者提供技术支持'
    },
    {
      year: '2024',
      month: '下半年',
      title: '社区成员汇聚',
      description: 'Bo Hu、Jiale Guo、Xin Lin、Adam Zhou等研究者加入，形成多元化的专业团队'
    },
    {
      year: '2024',
      month: '12月',
      title: 'ABMind Course Portal 上线',
      description: '正式发布课程门户网站，提供系统化的ABM学习资源和路径'
    },
    {
      year: '2025',
      month: '2月',
      title: 'Mesa 3.0 指南发布',
      description: '发布《Mesa 3.0：Python Agent-Based Modeling 新手指南》，标志着社区内容建设的重要里程碑'
    },
    {
      year: '2025',
      month: '未来',
      title: '持续发展',
      description: '计划扩大社区规模，增加更多实践项目，与国际ABM社区建立更紧密的合作关系'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            关于 ABMind 社区
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            ABMind 是由 Mesa 核心开发者 Boyu Wang 和 ABM 研究专家 Shuang Song 联合发起的中文 Agent-Based Modeling 学习社区。
            我们致力于为中文用户提供高质量的 ABM 和 Mesa 框架学习资源，降低学习门槛，促进复杂系统科学在中文世界的发展和应用。
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl overflow-hidden mb-16">
          <div className="px-8 py-12 text-center">
            <HeartIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              我们的使命
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              结合国际前沿技术和本土化需求，构建开放、专业的中文 ABM 学习生态系统，
              让更多研究者和学习者能够掌握 Mesa 框架和 ABM 理论，推动复杂系统建模在各个领域的创新应用。
            </p>
          </div>
        </div>

        {/* Community Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            社区价值观
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className={`w-16 h-16 ${colorClasses[value.color as keyof typeof colorClasses]} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founders */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            社区创始人
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {organizers.map((organizer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {organizer.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {organizer.role}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {organizer.affiliation}
                  </p>
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    专长：{organizer.expertise}
                  </p>
                  {organizer.links && (
                    <div className="flex justify-center gap-3 mb-4">
                      {organizer.links.homepage && (
                        <a
                          href={organizer.links.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          个人主页
                        </a>
                      )}
                      {organizer.links.github && (
                        <a
                          href={organizer.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          GitHub
                        </a>
                      )}
                      {organizer.links.paperbell && (
                        <a
                          href={organizer.links.paperbell}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          PaperBell
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {organizer.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contributors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            核心贡献者
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((contributor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <UserGroupIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {contributor.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-1 text-sm">
                    {contributor.role}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {contributor.affiliation}
                  </p>
                  <p className="text-xs text-gray-600 font-medium mb-2">
                    专长：{contributor.expertise}
                  </p>
                  {contributor.links && (
                    <div className="flex justify-center gap-2 mb-3">
                      {contributor.links.homepage && (
                        <a
                          href={contributor.links.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          主页
                        </a>
                      )}
                      {contributor.links.github && (
                        <a
                          href={contributor.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800 text-xs"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {contributor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            发展历程
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-px h-16 bg-gray-300 ml-6 mt-4"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-blue-600">
                        {milestone.year}
                      </span>
                      <span className="text-sm text-gray-500">
                        {milestone.month}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            社区数据
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
              <div className="text-gray-600">核心成员</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4+</div>
              <div className="text-gray-600">精品课程</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">学习路径</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">10+</div>
              <div className="text-gray-600">学习资源</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            联系我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                加入社区
              </h3>
              <div className="space-y-4">
                {siteConfig.site_info.social_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      {link.icon === 'email' && <EnvelopeIcon className="w-5 h-5 text-gray-600" />}
                      {link.icon === 'github' && <span className="text-gray-600 font-bold">GH</span>}
                      {link.icon === 'wechat' && <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />}
                      {link.icon === 'bilibili' && <span className="text-gray-600 font-bold">B</span>}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{link.name}</div>
                      <div className="text-sm text-gray-500">点击访问</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                参与方式
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">学习者</h4>
                  <p className="text-sm text-blue-700">
                    参加课程学习，完成实践项目，与社区成员交流经验
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">贡献者</h4>
                  <p className="text-sm text-green-700">
                    分享课程资源，撰写教程文档，帮助其他学习者
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">讲师</h4>
                  <p className="text-sm text-purple-700">
                    开设专业课程，分享研究成果，推动学科发展
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            准备加入我们了吗？
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            无论您是 ABM 初学者还是经验丰富的研究者，都欢迎加入我们的社区，
            一起探索复杂系统建模的无限可能。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learning-paths"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              开始学习
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              浏览课程
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}