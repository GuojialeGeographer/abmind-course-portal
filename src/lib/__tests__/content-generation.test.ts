import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { loadCourse } from '@/lib/data';
import { parseCourse } from '@/lib/yaml-parser';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * **Feature: abmind-course-portal, Property 10: Content generation consistency**
 * **Validates: Requirements 3.1, 3.2**
 */

// Generator for valid course data structures
const validCourseGenerator = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  type: fc.constantFrom('course', 'workshop', 'reading_group'),
  year: fc.integer({ min: 2000, max: new Date().getFullYear() + 5 }),
  difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }).map(tags => [...new Set(tags)]),
  instructors: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }).map(instructors => [...new Set(instructors)]),
  language: fc.constantFrom('zh', 'en'),
  summary: fc.string({ minLength: 10, maxLength: 500 }),
  sessions: fc.array(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
      title: fc.string({ minLength: 1, maxLength: 200 }),
      objectives: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
      materials: fc.record({
        slides: fc.option(fc.webUrl(), { nil: undefined }),
        code_repo: fc.option(fc.webUrl(), { nil: undefined }),
        recording: fc.option(fc.webUrl(), { nil: undefined }),
        references: fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 200 }),
            url: fc.webUrl(),
            type: fc.option(fc.constantFrom('paper', 'book', 'tutorial', 'docs'), { nil: undefined }),
          }),
          { maxLength: 10 }
        ),
      }),
    }),
    { minLength: 1, maxLength: 10 }
  ),
  external_links: fc.record({
    course_page: fc.option(fc.webUrl(), { nil: undefined }),
    materials_repo: fc.option(fc.webUrl(), { nil: undefined }),
  }),
  last_updated: fc.integer({ min: 2000, max: new Date().getFullYear() }).chain(year =>
    fc.integer({ min: 1, max: 12 }).chain(month =>
      fc.integer({ min: 1, max: 28 }).map(day =>
        `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      )
    )
  ),
});

describe('Content Generation Consistency', () => {
  describe('YAML Course Data Processing', () => {
    it('should successfully parse and validate any valid course YAML data', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          // Convert to YAML string
          const yamlString = yaml.dump(courseData);
          
          // Should parse without throwing
          expect(() => parseCourse(yamlString)).not.toThrow();
          
          // Parsed data should match original
          const parsed = parseCourse(yamlString);
          expect(parsed).toEqual(courseData);
        }),
        { numRuns: 100 }
      );
    });

    it('should generate properly structured course data with all required fields', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          const parsed = parseCourse(yamlString);
          
          // Validate all required fields are present and properly structured
          expect(parsed.id).toBeTruthy();
          expect(parsed.title).toBeTruthy();
          expect(parsed.type).toMatch(/^(course|workshop|reading_group)$/);
          expect(parsed.year).toBeGreaterThan(1999);
          expect(parsed.difficulty).toMatch(/^(beginner|intermediate|advanced)$/);
          expect(Array.isArray(parsed.tags)).toBe(true);
          expect(parsed.tags.length).toBeGreaterThan(0);
          expect(Array.isArray(parsed.instructors)).toBe(true);
          expect(parsed.instructors.length).toBeGreaterThan(0);
          expect(parsed.language).toMatch(/^(zh|en)$/);
          expect(parsed.summary).toBeTruthy();
          expect(Array.isArray(parsed.sessions)).toBe(true);
          expect(parsed.sessions.length).toBeGreaterThan(0);
          expect(parsed.external_links).toBeDefined();
          expect(parsed.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Session Content Structure', () => {
    it('should properly structure session information with objectives and materials', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          const parsed = parseCourse(yamlString);
          
          // Validate each session has proper structure
          parsed.sessions.forEach(session => {
            // Session must have required fields
            expect(session.id).toBeTruthy();
            expect(session.title).toBeTruthy();
            expect(Array.isArray(session.objectives)).toBe(true);
            expect(session.objectives.length).toBeGreaterThan(0);
            expect(session.materials).toBeDefined();
            
            // Objectives should be non-empty strings
            session.objectives.forEach(objective => {
              expect(typeof objective).toBe('string');
              expect(objective.length).toBeGreaterThan(0);
            });
            
            // Materials should have proper structure
            expect(session.materials).toHaveProperty('references');
            expect(Array.isArray(session.materials.references)).toBe(true);
            
            // Each reference should have title and URL
            session.materials.references.forEach(ref => {
              expect(ref.title).toBeTruthy();
              expect(ref.url).toBeTruthy();
              expect(ref.url).toMatch(/^https?:\/\/.+/);
            });
            
            // Optional materials should be valid URLs if present
            if (session.materials.slides) {
              expect(session.materials.slides).toMatch(/^https?:\/\/.+/);
            }
            if (session.materials.code_repo) {
              expect(session.materials.code_repo).toMatch(/^https?:\/\/.+/);
            }
            if (session.materials.recording) {
              expect(session.materials.recording).toMatch(/^https?:\/\/.+/);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Metadata Display Consistency', () => {
    it('should maintain consistent metadata structure across all course types', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          const parsed = parseCourse(yamlString);
          
          // Metadata should be consistently structured regardless of course type
          expect(parsed).toHaveProperty('id');
          expect(parsed).toHaveProperty('title');
          expect(parsed).toHaveProperty('type');
          expect(parsed).toHaveProperty('year');
          expect(parsed).toHaveProperty('difficulty');
          expect(parsed).toHaveProperty('tags');
          expect(parsed).toHaveProperty('instructors');
          expect(parsed).toHaveProperty('language');
          expect(parsed).toHaveProperty('summary');
          expect(parsed).toHaveProperty('sessions');
          expect(parsed).toHaveProperty('external_links');
          expect(parsed).toHaveProperty('last_updated');
          
          // Tags should be unique and non-empty
          const uniqueTags = [...new Set(parsed.tags)];
          expect(uniqueTags.length).toBe(parsed.tags.length);
          parsed.tags.forEach(tag => {
            expect(typeof tag).toBe('string');
            expect(tag.length).toBeGreaterThan(0);
          });
          
          // Instructors should be unique and non-empty
          const uniqueInstructors = [...new Set(parsed.instructors)];
          expect(uniqueInstructors.length).toBe(parsed.instructors.length);
          parsed.instructors.forEach(instructor => {
            expect(typeof instructor).toBe('string');
            expect(instructor.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should handle external links consistently', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          const parsed = parseCourse(yamlString);
          
          // External links should be properly structured
          expect(parsed.external_links).toBeDefined();
          
          // If course_page exists, it should be a valid URL
          if (parsed.external_links.course_page) {
            expect(parsed.external_links.course_page).toMatch(/^https?:\/\/.+/);
          }
          
          // If materials_repo exists, it should be a valid URL
          if (parsed.external_links.materials_repo) {
            expect(parsed.external_links.materials_repo).toMatch(/^https?:\/\/.+/);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Template Compliance', () => {
    it('should generate content that follows the defined template structure', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          const parsed = parseCourse(yamlString);
          
          // Template structure validation
          // 1. Course must have basic identification
          expect(parsed.id).toMatch(/^[a-z0-9-]+$/);
          expect(parsed.title.length).toBeGreaterThan(0);
          
          // 2. Course must have categorization
          expect(['course', 'workshop', 'reading_group']).toContain(parsed.type);
          expect(['beginner', 'intermediate', 'advanced']).toContain(parsed.difficulty);
          expect(['zh', 'en']).toContain(parsed.language);
          
          // 3. Course must have educational content
          expect(parsed.summary.length).toBeGreaterThanOrEqual(10);
          expect(parsed.sessions.length).toBeGreaterThan(0);
          
          // 4. Each session must follow session template
          parsed.sessions.forEach(session => {
            expect(session.id).toMatch(/^[a-z0-9-]+$/);
            expect(session.title.length).toBeGreaterThan(0);
            expect(session.objectives.length).toBeGreaterThan(0);
            expect(session.materials).toBeDefined();
            expect(Array.isArray(session.materials.references)).toBe(true);
          });
          
          // 5. Course must have temporal information
          expect(parsed.year).toBeGreaterThan(1999);
          expect(parsed.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          
          // 6. Course must have attribution
          expect(parsed.instructors.length).toBeGreaterThan(0);
          expect(parsed.tags.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Content Generation Edge Cases', () => {
    it('should handle courses with minimal session content', () => {
      const minimalCourseGenerator = fc.record({
        id: fc.constant('minimal-course'),
        title: fc.constant('Minimal Course'),
        type: fc.constant('course' as const),
        year: fc.constant(2024),
        difficulty: fc.constant('beginner' as const),
        tags: fc.constant(['minimal']),
        instructors: fc.constant(['Test Instructor']),
        language: fc.constant('en' as const),
        summary: fc.constant('A minimal course for testing'),
        sessions: fc.constant([{
          id: 'session-1',
          title: 'Single Session',
          objectives: ['Learn basics'],
          materials: { references: [] }
        }]),
        external_links: fc.constant({}),
        last_updated: fc.constant('2024-01-01'),
      });

      fc.assert(
        fc.property(minimalCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          expect(() => parseCourse(yamlString)).not.toThrow();
          
          const parsed = parseCourse(yamlString);
          expect(parsed.sessions).toHaveLength(1);
          expect(parsed.sessions[0].materials.references).toHaveLength(0);
        }),
        { numRuns: 10 }
      );
    });

    it('should handle courses with maximum session content', () => {
      const maximalSessionGenerator = fc.record({
        id: fc.constant('maximal-course'),
        title: fc.constant('Maximal Course'),
        type: fc.constant('workshop' as const),
        year: fc.constant(2024),
        difficulty: fc.constant('advanced' as const),
        tags: fc.constant(['comprehensive', 'advanced', 'detailed']),
        instructors: fc.constant(['Expert 1', 'Expert 2']),
        language: fc.constant('zh' as const),
        summary: fc.constant('A comprehensive course with maximum content'),
        sessions: fc.constant([{
          id: 'session-1',
          title: 'Comprehensive Session',
          objectives: [
            'Master advanced concepts',
            'Apply theoretical knowledge',
            'Develop practical skills',
            'Understand complex systems',
            'Create innovative solutions'
          ],
          materials: {
            slides: 'https://example.com/slides.pdf',
            code_repo: 'https://github.com/example/repo',
            recording: 'https://example.com/recording.mp4',
            references: [
              { title: 'Paper 1', url: 'https://example.com/paper1', type: 'paper' as const },
              { title: 'Book 1', url: 'https://example.com/book1', type: 'book' as const },
              { title: 'Tutorial 1', url: 'https://example.com/tutorial1', type: 'tutorial' as const },
              { title: 'Docs 1', url: 'https://example.com/docs1', type: 'docs' as const },
            ]
          }
        }]),
        external_links: fc.constant({
          course_page: 'https://example.com/course',
          materials_repo: 'https://github.com/example/materials'
        }),
        last_updated: fc.constant('2024-12-11'),
      });

      fc.assert(
        fc.property(maximalSessionGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          expect(() => parseCourse(yamlString)).not.toThrow();
          
          const parsed = parseCourse(yamlString);
          expect(parsed.sessions[0].objectives).toHaveLength(5);
          expect(parsed.sessions[0].materials.references).toHaveLength(4);
          expect(parsed.sessions[0].materials.slides).toBeTruthy();
          expect(parsed.sessions[0].materials.code_repo).toBeTruthy();
          expect(parsed.sessions[0].materials.recording).toBeTruthy();
        }),
        { numRuns: 10 }
      );
    });
  });
});