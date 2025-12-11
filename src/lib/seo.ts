import { Metadata } from 'next';
import { Course, LearningPath, Resource } from '@/types';
import { extractChineseKeywords, optimizeTextForDisplay } from './chinese-utils';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

const DEFAULT_SEO = {
  title: 'ABMind Course Portal - Agent-Based Modeling 中文社区',
  description: 'ABMind 是专注于 Agent-Based Modeling (ABM) 和 Mesa 框架的中文学习社区，提供系统化的课程资源和学习路径。',
  keywords: [
    'Agent-Based Modeling',
    'ABM',
    'Mesa',
    'Python',
    '多智能体建模',
    '复杂系统',
    '仿真建模',
    '城市建模',
    '环境建模',
    '交通建模',
    '中文社区'
  ],
  image: '/og-image.png',
  url: 'https://abmind.org',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_SEO.image,
    url = DEFAULT_SEO.url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
  } = config;

  const fullTitle = title.includes('ABMind') ? title : `${title} - ABMind Course Portal`;
  const allKeywords = [...DEFAULT_SEO.keywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'ABMind Course Portal',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
      type: type === 'article' ? 'article' : 'website',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && type === 'article' && { authors: [author] }),
      ...(section && type === 'article' && { section }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@ABMindCommunity',
      site: '@ABMindCommunity',
    },

    // Additional meta tags
    other: {
      'application-name': 'ABMind Course Portal',
      'apple-mobile-web-app-title': 'ABMind',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },

    // Alternates for language
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': url,
        'en-US': url.replace('abmind.org', 'en.abmind.org'),
      },
    },
  };
}

export function generateCourseMetadata(course: Course): Metadata {
  // Extract Chinese keywords from course content
  const contentKeywords = extractChineseKeywords(`${course.title} ${course.summary}`, 5);
  
  const keywords = [
    ...course.tags,
    course.difficulty,
    course.type,
    `${course.year}年`,
    ...course.instructors,
    ...contentKeywords,
  ];

  // Optimize description for mixed Chinese/English content
  const optimizedDescription = optimizeTextForDisplay(course.summary);

  return generateMetadata({
    title: course.title,
    description: optimizedDescription,
    keywords,
    type: 'article',
    publishedTime: course.last_updated,
    modifiedTime: course.last_updated,
    author: course.instructors.join(', '),
    section: 'courses',
    url: `${DEFAULT_SEO.url}/courses/${course.id}`,
  });
}

export function generateLearningPathMetadata(path: LearningPath): Metadata {
  // Extract Chinese keywords from path content
  const contentKeywords = extractChineseKeywords(`${path.title} ${path.description}`, 3);
  
  const keywords = [
    'learning path',
    '学习路径',
    path.recommended_audience,
    ...path.steps.map(step => step.type),
    ...contentKeywords,
  ];

  // Optimize description for mixed Chinese/English content
  const optimizedDescription = optimizeTextForDisplay(path.description);

  return generateMetadata({
    title: path.title,
    description: optimizedDescription,
    keywords,
    type: 'article',
    section: 'learning-paths',
    url: `${DEFAULT_SEO.url}/learning-paths`,
  });
}

export function generateResourceMetadata(resource: Resource): Metadata {
  const keywords = [
    ...resource.tags,
    resource.type,
    resource.language,
    ...(resource.difficulty ? [resource.difficulty] : []),
  ];

  return generateMetadata({
    title: resource.title,
    description: resource.description,
    keywords,
    type: 'article',
    section: 'resources',
    url: `${DEFAULT_SEO.url}/resources`,
  });
}

export function generateDomainMetadata(domain: string, domainConfig: any): Metadata {
  return generateMetadata({
    title: `${domainConfig.label} - 领域专题`,
    description: domainConfig.description,
    keywords: domainConfig.keywords,
    type: 'website',
    section: 'domains',
    url: `${DEFAULT_SEO.url}/domains/${domain}`,
  });
}

// Structured data generators
export function generateCourseStructuredData(course: Course) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.summary,
    provider: {
      '@type': 'Organization',
      name: 'ABMind Community',
      url: 'https://abmind.org',
    },
    instructor: course.instructors.map(instructor => ({
      '@type': 'Person',
      name: instructor,
    })),
    courseCode: course.id,
    educationalLevel: course.difficulty,
    inLanguage: course.language === 'zh' ? 'zh-CN' : 'en-US',
    dateCreated: course.last_updated,
    dateModified: course.last_updated,
    keywords: course.tags.join(', '),
    coursePrerequisites: course.tags.filter(tag => 
      tag.includes('prerequisite') || tag.includes('前置')
    ).join(', '),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `${course.sessions.length} sessions`,
    },
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ABMind Community',
    alternateName: 'ABMind 中文社区',
    url: 'https://abmind.org',
    logo: 'https://abmind.org/logo.png',
    description: 'Agent-Based Modeling 中文学习社区',
    foundingDate: '2023',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@abmind.org',
    },
    sameAs: [
      'https://github.com/ABMind-Community',
      'https://twitter.com/ABMindCommunity',
    ],
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ABMind Course Portal',
    alternateName: 'ABMind 课程门户',
    url: 'https://abmind.org',
    description: 'Agent-Based Modeling 中文学习社区课程门户',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://abmind.org/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}