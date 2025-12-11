import { Metadata } from 'next';
import { loadCourses, loadResources } from '@/lib/data';
import { DomainDetector } from '@/lib/domains';
import { DomainsPageClient } from './DomainsPageClient';

export const metadata: Metadata = {
  title: '应用领域 - ABMind Course Portal',
  description: '探索Agent-Based Modeling在不同领域的应用，包括城市建模、环境建模、交通建模等',
  keywords: '智能体建模, ABM, 城市建模, 环境建模, 交通建模, 社会建模, 经济建模, 计算建模'
};

export default async function DomainsPage() {
  // Get all courses and resources
  const courses = await loadCourses();
  const resources = await loadResources();

  // Get domain statistics
  const domainStats = DomainDetector.getDomainStatistics(courses, resources);

  // Get cross-domain relationships
  const relationships = DomainDetector.findCrossDomainRelationships(courses);

  return (
    <DomainsPageClient
      domainStats={domainStats}
      relationships={relationships}
      totalCourses={courses.length}
      totalResources={resources.length}
    />
  );
}