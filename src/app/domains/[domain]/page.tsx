import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadCourses, loadResources } from '@/lib/data';
import { DOMAIN_CONFIG, DomainDetector, getDomainSpecificInfo } from '@/lib/domains';
import { Domain } from '@/types';
import { DomainPageClient } from './DomainPageClient';
import { generateDomainMetadata } from '@/lib/seo';

interface DomainPageProps {
  params: {
    domain: string;
  };
}

export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
  const domain = params.domain as Domain;
  const domainConfig = DOMAIN_CONFIG[domain];
  
  if (!domainConfig) {
    return {
      title: '领域未找到 - ABMind Course Portal'
    };
  }

  return generateDomainMetadata(domain, domainConfig);
}

export async function generateStaticParams() {
  return Object.keys(DOMAIN_CONFIG).map((domain) => ({
    domain,
  }));
}

export default async function DomainPage({ params }: DomainPageProps) {
  const domain = params.domain as Domain;
  const domainConfig = DOMAIN_CONFIG[domain];
  
  if (!domainConfig) {
    notFound();
  }

  // Get all courses and resources
  const courses = await loadCourses();
  const resources = await loadResources();

  // Filter by domain
  const domainCourses = courses.filter(course => {
    const courseDomains = DomainDetector.detectCourseDomains(course);
    return courseDomains.includes(domain);
  });

  const domainResources = resources.filter(resource => {
    const resourceDomains = DomainDetector.detectResourceDomains(resource);
    return resourceDomains.includes(domain);
  });

  // Get cross-domain relationships
  const relationships = DomainDetector.findCrossDomainRelationships(courses);
  const domainRelationships = relationships.filter(rel => 
    rel.domains.includes(domain)
  );

  // Get domain-specific tools and methodologies
  const domainInfo = getDomainSpecificInfo([domain]);

  // Get recommended learning sequence for this domain
  const learningSequence = DomainDetector.getRecommendedLearningSequence([domain], courses);

  return (
    <DomainPageClient
      domain={domain}
      domainConfig={domainConfig}
      courses={domainCourses}
      resources={domainResources}
      relationships={domainRelationships}
      tools={domainInfo.tools}
      methodologies={domainInfo.methodologies}
      learningSequence={learningSequence}
    />
  );
}