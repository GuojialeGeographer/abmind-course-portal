import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { DomainDetector, DOMAIN_CONFIG, filterByDomains } from '../domains';
import { Course, Resource, Domain } from '@/types';

/**
 * **Feature: abmind-course-portal, Property 9: Domain categorization accuracy**
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
 */

// Generators for test data
const domainArbitrary = fc.constantFrom(...Object.keys(DOMAIN_CONFIG) as Domain[]);

const courseArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  type: fc.constantFrom('course', 'workshop', 'reading_group'),
  year: fc.integer({ min: 2020, max: 2025 }),
  difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  instructors: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { minLength: 1, maxLength: 5 }),
  language: fc.constantFrom('zh', 'en'),
  summary: fc.string({ minLength: 10, maxLength: 200 }),
  sessions: fc.array(fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    title: fc.string({ minLength: 5, maxLength: 50 }),
    objectives: fc.array(fc.string({ minLength: 5, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
    materials: fc.record({
      slides: fc.option(fc.webUrl()),
      code_repo: fc.option(fc.webUrl()),
      recording: fc.option(fc.webUrl()),
      references: fc.array(fc.record({
        title: fc.string({ minLength: 5, maxLength: 50 }),
        url: fc.webUrl(),
        type: fc.option(fc.constantFrom('paper', 'book', 'tutorial', 'docs'))
      }), { maxLength: 5 })
    })
  }), { minLength: 1, maxLength: 10 }),
  external_links: fc.record({
    course_page: fc.option(fc.webUrl()),
    materials_repo: fc.option(fc.webUrl())
  }),
  last_updated: fc.integer({ min: 2020, max: 2025 })
    .chain(year => fc.integer({ min: 1, max: 12 })
      .chain(month => fc.integer({ min: 1, max: 28 })
        .map(day => `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)))
}) as fc.Arbitrary<Course>;

const resourceArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  type: fc.constantFrom('docs', 'tutorial', 'paper', 'book', 'dataset', 'tool'),
  url: fc.webUrl(),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  language: fc.constantFrom('zh', 'en'),
  difficulty: fc.option(fc.constantFrom('beginner', 'intermediate', 'advanced'))
}) as fc.Arbitrary<Resource>;

// Helper function to create course with specific domain keywords
const courseWithDomainKeywords = (domain: Domain): fc.Arbitrary<Course> => {
  const domainConfig = DOMAIN_CONFIG[domain];
  const keyword = fc.constantFrom(...domainConfig.keywords);
  
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }),
    title: keyword.map(k => `Course about ${k}`),
    type: fc.constantFrom('course', 'workshop', 'reading_group'),
    year: fc.integer({ min: 2020, max: 2025 }),
    difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
    tags: fc.array(fc.oneof(keyword, fc.string({ minLength: 1, maxLength: 20 })), { minLength: 1, maxLength: 10 }),
    instructors: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { minLength: 1, maxLength: 5 }),
    language: fc.constantFrom('zh', 'en'),
    summary: keyword.map(k => `This course covers ${k} and related topics in detail.`),
    sessions: fc.array(fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      title: fc.string({ minLength: 5, maxLength: 50 }),
      objectives: fc.array(fc.string({ minLength: 5, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      materials: fc.record({
        slides: fc.option(fc.webUrl()),
        code_repo: fc.option(fc.webUrl()),
        recording: fc.option(fc.webUrl()),
        references: fc.array(fc.record({
          title: fc.string({ minLength: 5, maxLength: 50 }),
          url: fc.webUrl(),
          type: fc.option(fc.constantFrom('paper', 'book', 'tutorial', 'docs'))
        }), { maxLength: 5 })
      })
    }), { minLength: 1, maxLength: 10 }),
    external_links: fc.record({
      course_page: fc.option(fc.webUrl()),
      materials_repo: fc.option(fc.webUrl())
    }),
    last_updated: fc.integer({ min: 2020, max: 2025 })
      .chain(year => fc.integer({ min: 1, max: 12 })
        .chain(month => fc.integer({ min: 1, max: 28 })
          .map(day => `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)))
  }) as fc.Arbitrary<Course>;
};

// Helper function to create resource with specific domain keywords
const resourceWithDomainKeywords = (domain: Domain): fc.Arbitrary<Resource> => {
  const domainConfig = DOMAIN_CONFIG[domain];
  const keyword = fc.constantFrom(...domainConfig.keywords);
  
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }),
    title: keyword.map(k => `Resource about ${k}`),
    type: fc.constantFrom('docs', 'tutorial', 'paper', 'book', 'dataset', 'tool'),
    url: fc.webUrl(),
    tags: fc.array(fc.oneof(keyword, fc.string({ minLength: 1, maxLength: 20 })), { minLength: 1, maxLength: 10 }),
    description: keyword.map(k => `This resource provides information about ${k} and related concepts.`),
    language: fc.constantFrom('zh', 'en'),
    difficulty: fc.option(fc.constantFrom('beginner', 'intermediate', 'advanced'))
  }) as fc.Arbitrary<Resource>;
};

describe('Domain Categorization Property Tests', () => {
  describe('Domain Detection', () => {
    it('should detect domains based on keywords in course content', () => {
      fc.assert(fc.property(
        domainArbitrary,
        (targetDomain) => {
          return fc.assert(fc.property(
            courseWithDomainKeywords(targetDomain),
            (course) => {
              const detectedDomains = DomainDetector.detectCourseDomains(course);
              
              // The course should be detected as belonging to the target domain
              expect(detectedDomains).toContain(targetDomain);
              
              // All detected domains should be valid
              detectedDomains.forEach(domain => {
                expect(Object.keys(DOMAIN_CONFIG)).toContain(domain);
              });
              
              return true;
            }
          ), { numRuns: 10 });
        }
      ), { numRuns: 10 });
    });

    it('should detect domains based on keywords in resource content', () => {
      fc.assert(fc.property(
        domainArbitrary,
        (targetDomain) => {
          return fc.assert(fc.property(
            resourceWithDomainKeywords(targetDomain),
            (resource) => {
              const detectedDomains = DomainDetector.detectResourceDomains(resource);
              
              // The resource should be detected as belonging to the target domain
              expect(detectedDomains).toContain(targetDomain);
              
              // All detected domains should be valid
              detectedDomains.forEach(domain => {
                expect(Object.keys(DOMAIN_CONFIG)).toContain(domain);
              });
              
              return true;
            }
          ), { numRuns: 10 });
        }
      ), { numRuns: 10 });
    });

    it('should return empty array for content without domain keywords', () => {
      fc.assert(fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => 
            !Object.values(DOMAIN_CONFIG).some(config => 
              config.keywords.some(keyword => s.toLowerCase().includes(keyword.toLowerCase()))
            )
          ),
          type: fc.constantFrom('course', 'workshop', 'reading_group'),
          year: fc.integer({ min: 2020, max: 2025 }),
          difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
          tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => 
            !Object.values(DOMAIN_CONFIG).some(config => 
              config.keywords.some(keyword => s.toLowerCase().includes(keyword.toLowerCase()))
            )
          ), { minLength: 1, maxLength: 5 }),
          instructors: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { minLength: 1, maxLength: 5 }),
          language: fc.constantFrom('zh', 'en'),
          summary: fc.string({ minLength: 10, maxLength: 200 }).filter(s => 
            !Object.values(DOMAIN_CONFIG).some(config => 
              config.keywords.some(keyword => s.toLowerCase().includes(keyword.toLowerCase()))
            )
          ),
          sessions: fc.array(fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            title: fc.string({ minLength: 5, maxLength: 50 }),
            objectives: fc.array(fc.string({ minLength: 5, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
            materials: fc.record({
              slides: fc.option(fc.webUrl()),
              code_repo: fc.option(fc.webUrl()),
              recording: fc.option(fc.webUrl()),
              references: fc.array(fc.record({
                title: fc.string({ minLength: 5, maxLength: 50 }),
                url: fc.webUrl(),
                type: fc.option(fc.constantFrom('paper', 'book', 'tutorial', 'docs'))
              }), { maxLength: 5 })
            })
          }), { minLength: 1, maxLength: 10 }),
          external_links: fc.record({
            course_page: fc.option(fc.webUrl()),
            materials_repo: fc.option(fc.webUrl())
          }),
          last_updated: fc.integer({ min: 2020, max: 2025 })
            .chain(year => fc.integer({ min: 1, max: 12 })
              .chain(month => fc.integer({ min: 1, max: 28 })
                .map(day => `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)))
        }) as fc.Arbitrary<Course>,
        (course) => {
          const detectedDomains = DomainDetector.detectCourseDomains(course);
          
          // Should return empty array when no domain keywords are found
          expect(detectedDomains).toEqual([]);
          
          return true;
        }
      ), { numRuns: 50 });
    });
  });

  describe('Domain Filtering', () => {
    it('should filter courses by selected domains correctly', () => {
      fc.assert(fc.property(
        fc.array(courseArbitrary, { minLength: 5, maxLength: 20 }),
        fc.array(domainArbitrary, { minLength: 1, maxLength: 3 }),
        (courses, selectedDomains) => {
          const filteredCourses = filterByDomains(courses, selectedDomains);
          
          // All filtered courses should belong to at least one selected domain
          filteredCourses.forEach(course => {
            const courseDomains = DomainDetector.detectCourseDomains(course);
            const hasMatchingDomain = selectedDomains.some(domain => 
              courseDomains.includes(domain)
            );
            expect(hasMatchingDomain).toBe(true);
          });
          
          // Filtered results should be a subset of original courses
          expect(filteredCourses.length).toBeLessThanOrEqual(courses.length);
          
          return true;
        }
      ), { numRuns: 100 });
    });

    it('should filter resources by selected domains correctly', () => {
      fc.assert(fc.property(
        fc.array(resourceArbitrary, { minLength: 5, maxLength: 20 }),
        fc.array(domainArbitrary, { minLength: 1, maxLength: 3 }),
        (resources, selectedDomains) => {
          const filteredResources = filterByDomains(resources, selectedDomains);
          
          // All filtered resources should belong to at least one selected domain
          filteredResources.forEach(resource => {
            const resourceDomains = DomainDetector.detectResourceDomains(resource);
            const hasMatchingDomain = selectedDomains.some(domain => 
              resourceDomains.includes(domain)
            );
            expect(hasMatchingDomain).toBe(true);
          });
          
          // Filtered results should be a subset of original resources
          expect(filteredResources.length).toBeLessThanOrEqual(resources.length);
          
          return true;
        }
      ), { numRuns: 100 });
    });

    it('should return all items when no domains are selected', () => {
      fc.assert(fc.property(
        fc.array(courseArbitrary, { minLength: 1, maxLength: 10 }),
        (courses) => {
          const filteredCourses = filterByDomains(courses, []);
          
          // Should return all courses when no domains are selected
          expect(filteredCourses).toEqual(courses);
          
          return true;
        }
      ), { numRuns: 50 });
    });
  });

  describe('Domain Statistics', () => {
    it('should provide accurate domain statistics', () => {
      fc.assert(fc.property(
        fc.array(courseArbitrary, { minLength: 1, maxLength: 10 }),
        fc.array(resourceArbitrary, { minLength: 1, maxLength: 10 }),
        (courses, resources) => {
          const stats = DomainDetector.getDomainStatistics(courses, resources);
          
          // All domains should be present in statistics
          Object.keys(DOMAIN_CONFIG).forEach(domain => {
            expect(stats).toHaveProperty(domain);
            expect(stats[domain as Domain]).toHaveProperty('courses');
            expect(stats[domain as Domain]).toHaveProperty('resources');
            expect(stats[domain as Domain]).toHaveProperty('total');
            
            // Total should equal courses + resources
            expect(stats[domain as Domain].total).toBe(
              stats[domain as Domain].courses + stats[domain as Domain].resources
            );
            
            // Counts should be non-negative
            expect(stats[domain as Domain].courses).toBeGreaterThanOrEqual(0);
            expect(stats[domain as Domain].resources).toBeGreaterThanOrEqual(0);
            expect(stats[domain as Domain].total).toBeGreaterThanOrEqual(0);
          });
          
          return true;
        }
      ), { numRuns: 100 });
    });
  });

  describe('Cross-Domain Relationships', () => {
    it('should identify cross-domain relationships correctly', () => {
      fc.assert(fc.property(
        fc.array(courseArbitrary, { minLength: 2, maxLength: 10 }),
        (courses) => {
          const relationships = DomainDetector.findCrossDomainRelationships(courses);
          
          relationships.forEach(relationship => {
            // Each relationship should have valid course and domains
            expect(courses).toContainEqual(relationship.course);
            expect(relationship.domains.length).toBeGreaterThan(0);
            
            // All domains should be valid
            relationship.domains.forEach(domain => {
              expect(Object.keys(DOMAIN_CONFIG)).toContain(domain);
            });
            
            // Related courses should share at least one domain
            relationship.relatedCourses.forEach(({ course: relatedCourse, sharedDomains }) => {
              expect(courses).toContainEqual(relatedCourse);
              expect(sharedDomains.length).toBeGreaterThan(0);
              
              // Shared domains should be subset of both course domains
              const relatedCourseDomains = DomainDetector.detectCourseDomains(relatedCourse);
              sharedDomains.forEach(sharedDomain => {
                expect(relationship.domains).toContain(sharedDomain);
                expect(relatedCourseDomains).toContain(sharedDomain);
              });
            });
          });
          
          return true;
        }
      ), { numRuns: 50 });
    });
  });

  describe('Learning Sequence Generation', () => {
    it('should generate valid learning sequences for target domains', () => {
      fc.assert(fc.property(
        fc.array(domainArbitrary, { minLength: 1, maxLength: 3 }),
        fc.array(courseArbitrary, { minLength: 3, maxLength: 15 }),
        (targetDomains, courses) => {
          const sequence = DomainDetector.getRecommendedLearningSequence(targetDomains, courses);
          
          sequence.forEach(phase => {
            // Each phase should have valid structure
            expect(phase.phase).toBeTruthy();
            expect(phase.description).toBeTruthy();
            expect(Array.isArray(phase.courses)).toBe(true);
            expect(Array.isArray(phase.domains)).toBe(true);
            
            // All courses in phase should be from the original course list
            phase.courses.forEach(course => {
              expect(courses).toContainEqual(course);
            });
            
            // All domains should be valid
            phase.domains.forEach(domain => {
              expect(Object.keys(DOMAIN_CONFIG)).toContain(domain);
            });
          });
          
          return true;
        }
      ), { numRuns: 50 });
    });
  });
});