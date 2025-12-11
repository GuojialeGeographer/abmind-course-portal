import { Domain, DomainInfo, Course, Resource } from '@/types';

// Domain configuration with tools, methodologies, and keywords
export const DOMAIN_CONFIG: Record<Domain, DomainInfo> = {
  urban: {
    id: 'urban',
    label: '城市建模',
    description: '城市规划、交通流、人口动态等城市系统建模',
    tools: ['SUMO', 'GTFS', 'OpenStreetMap', 'PostGIS', 'QGIS'],
    methodologies: ['空间分析', '网络分析', '人口流动建模', '土地利用建模'],
    keywords: ['urban', 'city', 'planning', 'transportation', 'spatial', 'gis', '城市', '规划', '交通', '空间']
  },
  environmental: {
    id: 'environmental',
    label: '环境建模',
    description: '生态系统、气候变化、环境保护等环境科学建模',
    tools: ['NetLogo', 'R', 'GDAL', 'Climate Data', 'Satellite Imagery'],
    methodologies: ['生态系统建模', '气候模拟', '环境影响评估', '生物多样性分析'],
    keywords: ['environment', 'ecology', 'climate', 'ecosystem', 'biodiversity', '环境', '生态', '气候', '生物']
  },
  transportation: {
    id: 'transportation',
    label: '交通建模',
    description: '交通流量、物流网络、出行行为等交通系统建模',
    tools: ['SUMO', 'GTFS', 'OpenStreetMap', 'Traffic Simulators', 'GPS Data'],
    methodologies: ['交通流建模', '路径规划', '出行需求分析', '物流优化'],
    keywords: ['transport', 'traffic', 'mobility', 'logistics', 'routing', '交通', '出行', '物流', '路径']
  },
  social: {
    id: 'social',
    label: '社会建模',
    description: '社会网络、群体行为、文化传播等社会科学建模',
    tools: ['NetworkX', 'Gephi', 'Social Media APIs', 'Survey Data', 'Census Data'],
    methodologies: ['社会网络分析', '群体动力学', '信息传播', '行为建模'],
    keywords: ['social', 'network', 'behavior', 'culture', 'community', '社会', '网络', '行为', '文化', '群体']
  },
  economics: {
    id: 'economics',
    label: '经济建模',
    description: '市场动态、经济政策、金融系统等经济学建模',
    tools: ['Financial APIs', 'Economic Databases', 'Statistical Software', 'Market Data'],
    methodologies: ['市场建模', '政策分析', '金融风险评估', '经济预测'],
    keywords: ['economics', 'market', 'finance', 'policy', 'trade', '经济', '市场', '金融', '政策', '贸易']
  },
  computational: {
    id: 'computational',
    label: '计算建模',
    description: '算法优化、并行计算、模型验证等计算科学方法',
    tools: ['HPC Clusters', 'GPU Computing', 'Profiling Tools', 'Version Control'],
    methodologies: ['并行计算', '算法优化', '模型验证', '性能分析'],
    keywords: ['computation', 'algorithm', 'optimization', 'parallel', 'performance', '计算', '算法', '优化', '并行', '性能']
  }
};

// Domain detection utilities
export class DomainDetector {
  /**
   * Detect domains for a course based on its tags, title, and summary
   */
  static detectCourseDomains(course: Course): Domain[] {
    const searchText = `${course.title} ${course.summary} ${course.tags.join(' ')}`.toLowerCase();
    const detectedDomains: Domain[] = [];

    Object.values(DOMAIN_CONFIG).forEach(domain => {
      const hasKeyword = domain.keywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        detectedDomains.push(domain.id);
      }
    });

    return detectedDomains;
  }

  /**
   * Detect domains for a resource based on its tags, title, and description
   */
  static detectResourceDomains(resource: Resource): Domain[] {
    const searchText = `${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase();
    const detectedDomains: Domain[] = [];

    Object.values(DOMAIN_CONFIG).forEach(domain => {
      const hasKeyword = domain.keywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        detectedDomains.push(domain.id);
      }
    });

    return detectedDomains;
  }

  /**
   * Get domain statistics from courses and resources
   */
  static getDomainStatistics(courses: Course[], resources: Resource[]) {
    const domainCounts: Record<Domain, { courses: number; resources: number; total: number }> = {} as any;

    // Initialize counts
    Object.keys(DOMAIN_CONFIG).forEach(domain => {
      domainCounts[domain as Domain] = { courses: 0, resources: 0, total: 0 };
    });

    // Count courses by domain
    courses.forEach(course => {
      const domains = this.detectCourseDomains(course);
      domains.forEach(domain => {
        domainCounts[domain].courses++;
        domainCounts[domain].total++;
      });
    });

    // Count resources by domain
    resources.forEach(resource => {
      const domains = this.detectResourceDomains(resource);
      domains.forEach(domain => {
        domainCounts[domain].resources++;
        domainCounts[domain].total++;
      });
    });

    return domainCounts;
  }

  /**
   * Find cross-domain relationships between courses
   */
  static findCrossDomainRelationships(courses: Course[]) {
    const relationships: Array<{
      course: Course;
      domains: Domain[];
      relatedCourses: Array<{ course: Course; sharedDomains: Domain[] }>;
    }> = [];

    courses.forEach(course => {
      const courseDomains = this.detectCourseDomains(course);
      const relatedCourses: Array<{ course: Course; sharedDomains: Domain[] }> = [];

      courses.forEach(otherCourse => {
        if (course.id !== otherCourse.id) {
          const otherDomains = this.detectCourseDomains(otherCourse);
          const sharedDomains = courseDomains.filter(domain => otherDomains.includes(domain));
          
          if (sharedDomains.length > 0) {
            relatedCourses.push({ course: otherCourse, sharedDomains });
          }
        }
      });

      if (courseDomains.length > 0) {
        relationships.push({
          course,
          domains: courseDomains,
          relatedCourses: relatedCourses.slice(0, 5) // Limit to top 5 related courses
        });
      }
    });

    return relationships;
  }

  /**
   * Get recommended learning sequence across domains
   */
  static getRecommendedLearningSequence(targetDomains: Domain[], courses: Course[]) {
    const sequence: Array<{
      phase: string;
      description: string;
      courses: Course[];
      domains: Domain[];
    }> = [];

    // Phase 1: Foundational courses (beginner level, computational domain)
    const foundationalCourses = courses.filter(course => {
      const domains = this.detectCourseDomains(course);
      return course.difficulty === 'beginner' && 
             (domains.includes('computational') || domains.length === 0);
    });

    if (foundationalCourses.length > 0) {
      sequence.push({
        phase: '基础阶段',
        description: 'ABM基础概念和编程技能',
        courses: foundationalCourses,
        domains: ['computational']
      });
    }

    // Phase 2: Domain-specific intermediate courses
    const intermediateCourses = courses.filter(course => {
      const domains = this.detectCourseDomains(course);
      return course.difficulty === 'intermediate' && 
             domains.some(domain => targetDomains.includes(domain));
    });

    if (intermediateCourses.length > 0) {
      sequence.push({
        phase: '专业阶段',
        description: '特定领域的ABM应用',
        courses: intermediateCourses,
        domains: targetDomains
      });
    }

    // Phase 3: Advanced and cross-domain courses
    const advancedCourses = courses.filter(course => {
      const domains = this.detectCourseDomains(course);
      return course.difficulty === 'advanced' && 
             (domains.some(domain => targetDomains.includes(domain)) || domains.length > 1);
    });

    if (advancedCourses.length > 0) {
      sequence.push({
        phase: '高级阶段',
        description: '高级技术和跨领域应用',
        courses: advancedCourses,
        domains: targetDomains
      });
    }

    return sequence;
  }
}

// Domain filtering utilities
export function filterByDomains<T extends Course | Resource>(
  items: T[], 
  selectedDomains: Domain[]
): T[] {
  if (selectedDomains.length === 0) {
    return items;
  }

  return items.filter(item => {
    const itemDomains = 'sessions' in item 
      ? DomainDetector.detectCourseDomains(item as Course)
      : DomainDetector.detectResourceDomains(item as Resource);
    
    return selectedDomains.some(domain => itemDomains.includes(domain));
  });
}

// Get domain-specific tools and methodologies for a set of domains
export function getDomainSpecificInfo(domains: Domain[]) {
  const tools = new Set<string>();
  const methodologies = new Set<string>();

  domains.forEach(domain => {
    const config = DOMAIN_CONFIG[domain];
    if (config) {
      config.tools.forEach(tool => tools.add(tool));
      config.methodologies.forEach(methodology => methodologies.add(methodology));
    }
  });

  return {
    tools: Array.from(tools),
    methodologies: Array.from(methodologies)
  };
}