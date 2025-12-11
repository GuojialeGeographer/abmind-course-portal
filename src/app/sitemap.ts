import { MetadataRoute } from 'next';
import { loadCourses, getAllDomains } from '@/lib/data';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abmind.org';
  
  // Get all courses and domains for dynamic routes
  const courses = await loadCourses();
  const domains = await getAllDomains();
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learning-paths`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/domains`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  // Course pages
  const coursePages = courses.map(course => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date(course.last_updated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Domain pages
  const domainPages = domains.map(domain => ({
    url: `${baseUrl}/domains/${domain}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...coursePages, ...domainPages];
}