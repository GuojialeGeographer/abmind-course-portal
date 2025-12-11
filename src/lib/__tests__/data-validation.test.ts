import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  CourseSchema,
  LearningPathSchema,
  ResourceSchema,
  SiteConfigSchema,
  type CourseData,
  type LearningPathData,
  type ResourceData,
  type SiteConfigData,
} from '../schemas';
import {
  parseCourse,
  parseLearningPath,
  parseResource,
  parseSiteConfig,
  ValidationError,
  YAMLParseError,
} from '../yaml-parser';
import * as yaml from 'js-yaml';

/**
 * **Feature: abmind-course-portal, Property 5: Data validation integrity**
 * **Validates: Requirements 3.5, 3.4**
 */

// Generators for valid data structures
const validCourseGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  type: fc.constantFrom('course', 'workshop', 'reading_group'),
  year: fc.integer({ min: 2000, max: new Date().getFullYear() + 5 }),
  difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
  tags: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  instructors: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  language: fc.constantFrom('zh', 'en'),
  summary: fc.string({ minLength: 10 }),
  sessions: fc.array(
    fc.record({
      id: fc.string({ minLength: 1 }),
      title: fc.string({ minLength: 1 }),
      objectives: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
      materials: fc.record({
        slides: fc.option(fc.webUrl(), { nil: undefined }),
        code_repo: fc.option(fc.webUrl(), { nil: undefined }),
        recording: fc.option(fc.webUrl(), { nil: undefined }),
        references: fc.array(
          fc.record({
            title: fc.string({ minLength: 1 }),
            url: fc.webUrl(),
            type: fc.option(fc.constantFrom('paper', 'book', 'tutorial', 'docs'), { nil: undefined }),
          })
        ),
      }),
    }),
    { minLength: 1 }
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

const validLearningPathGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 10 }),
  recommended_audience: fc.string({ minLength: 1 }),
  estimated_duration: fc.string({ minLength: 1 }),
  steps: fc.array(
    fc.record({
      order: fc.integer({ min: 1 }),
      type: fc.constantFrom('course', 'resource', 'practice'),
      course_id: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      resource_id: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      note: fc.string({ minLength: 1 }),
      optional: fc.boolean(),
    }).chain(step => {
      // Ensure proper IDs based on type
      if (step.type === 'course') {
        return fc.constant({ ...step, course_id: step.course_id || 'course-1' });
      } else if (step.type === 'resource') {
        return fc.constant({ ...step, resource_id: step.resource_id || 'resource-1' });
      }
      return fc.constant(step);
    }),
    { minLength: 1 }
  ),
});

const validResourceGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  type: fc.constantFrom('docs', 'tutorial', 'paper', 'book', 'dataset', 'tool'),
  url: fc.webUrl(),
  tags: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  description: fc.string({ minLength: 10 }),
  language: fc.constantFrom('zh', 'en'),
  difficulty: fc.option(fc.constantFrom('beginner', 'intermediate', 'advanced'), { nil: undefined }),
});

const validSiteConfigGenerator = fc.record({
  site_info: fc.record({
    title: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 10 }),
    url: fc.webUrl(),
    social_links: fc.array(
      fc.record({
        name: fc.string({ minLength: 1 }),
        url: fc.webUrl(),
        icon: fc.string({ minLength: 1 }),
      })
    ),
  }),
  navigation: fc.array(
    fc.record({
      label: fc.string({ minLength: 1 }),
      href: fc.string({ minLength: 1 }),
      active: fc.option(fc.boolean(), { nil: undefined }),
      children: fc.option(fc.array(
        fc.record({
          label: fc.string({ minLength: 1 }),
          href: fc.string({ minLength: 1 }),
          active: fc.option(fc.boolean(), { nil: undefined }),
        })
      ), { nil: undefined }),
    }),
    { minLength: 1 }
  ),
  featured_courses: fc.array(fc.string({ minLength: 1 })),
  announcements: fc.array(
    fc.record({
      title: fc.string({ minLength: 1 }),
      content: fc.string({ minLength: 1 }),
      date: fc.integer({ min: 2000, max: new Date().getFullYear() }).chain(year =>
        fc.integer({ min: 1, max: 12 }).chain(month =>
          fc.integer({ min: 1, max: 28 }).map(day =>
            `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          )
        )
      ),
      type: fc.constantFrom('info', 'warning', 'success'),
    })
  ),
});

describe('Data Validation Integrity', () => {
  describe('Schema Validation', () => {
    it('should accept all valid course data structures', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          expect(() => CourseSchema.parse(courseData)).not.toThrow();
          const parsed = CourseSchema.parse(courseData);
          expect(parsed).toEqual(courseData);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept all valid learning path data structures', () => {
      fc.assert(
        fc.property(validLearningPathGenerator, (pathData) => {
          expect(() => LearningPathSchema.parse(pathData)).not.toThrow();
          const parsed = LearningPathSchema.parse(pathData);
          expect(parsed).toEqual(pathData);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept all valid resource data structures', () => {
      fc.assert(
        fc.property(validResourceGenerator, (resourceData) => {
          expect(() => ResourceSchema.parse(resourceData)).not.toThrow();
          const parsed = ResourceSchema.parse(resourceData);
          expect(parsed).toEqual(resourceData);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept all valid site config data structures', () => {
      fc.assert(
        fc.property(validSiteConfigGenerator, (configData) => {
          expect(() => SiteConfigSchema.parse(configData)).not.toThrow();
          const parsed = SiteConfigSchema.parse(configData);
          expect(parsed).toEqual(configData);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('YAML Parsing and Validation', () => {
    it('should successfully parse and validate valid course YAML', () => {
      fc.assert(
        fc.property(validCourseGenerator, (courseData) => {
          const yamlString = yaml.dump(courseData);
          expect(() => parseCourse(yamlString)).not.toThrow();
          const parsed = parseCourse(yamlString);
          expect(parsed).toEqual(courseData);
        }),
        { numRuns: 100 }
      );
    });

    it('should successfully parse and validate valid learning path YAML', () => {
      fc.assert(
        fc.property(validLearningPathGenerator, (pathData) => {
          const yamlString = yaml.dump(pathData);
          expect(() => parseLearningPath(yamlString)).not.toThrow();
          const parsed = parseLearningPath(yamlString);
          expect(parsed).toEqual(pathData);
        }),
        { numRuns: 100 }
      );
    });

    it('should successfully parse and validate valid resource YAML', () => {
      fc.assert(
        fc.property(validResourceGenerator, (resourceData) => {
          const yamlString = yaml.dump(resourceData);
          expect(() => parseResource(yamlString)).not.toThrow();
          const parsed = parseResource(yamlString);
          expect(parsed).toEqual(resourceData);
        }),
        { numRuns: 100 }
      );
    });

    it('should successfully parse and validate valid site config YAML', () => {
      fc.assert(
        fc.property(validSiteConfigGenerator, (configData) => {
          const yamlString = yaml.dump(configData);
          expect(() => parseSiteConfig(yamlString)).not.toThrow();
          const parsed = parseSiteConfig(yamlString);
          expect(parsed).toEqual(configData);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Invalid Data Rejection', () => {
    it('should reject course data with invalid structure', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.option(fc.string()),
            title: fc.option(fc.string()),
            type: fc.option(fc.string()),
            // Intentionally missing required fields or invalid types
          }),
          (invalidData) => {
            expect(() => CourseSchema.parse(invalidData)).toThrow();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject invalid YAML syntax', () => {
      const invalidYaml = 'invalid: yaml: content: [unclosed';
      expect(() => parseCourse(invalidYaml)).toThrow(YAMLParseError);
    });

    it('should provide meaningful error messages for validation failures', () => {
      const invalidCourse = {
        id: '', // Invalid: empty string
        title: 'Valid Title',
        type: 'invalid-type', // Invalid: not in enum
        year: 1999, // Invalid: too early
        // Missing required fields
      };

      const yamlString = yaml.dump(invalidCourse);
      
      expect(() => parseCourse(yamlString)).toThrow(ValidationError);
      
      try {
        parseCourse(yamlString);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('Validation failed');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty YAML content', () => {
      expect(() => parseCourse('')).toThrow();
    });

    it('should handle null/undefined YAML content', () => {
      expect(() => parseCourse('null')).toThrow(ValidationError);
      expect(() => parseCourse('undefined')).toThrow();
    });

    it('should validate URL formats in external links', () => {
      const validCourse = {
        id: 'test-course',
        title: 'Test Course',
        type: 'course' as const,
        year: 2024,
        difficulty: 'beginner' as const,
        tags: ['test'],
        instructors: ['Test Instructor'],
        language: 'en' as const,
        summary: 'A test course for validation',
        sessions: [{
          id: 'session-1',
          title: 'Test Session',
          objectives: ['Learn testing'],
          materials: { references: [] }
        }],
        external_links: {
          course_page: 'not-a-valid-url',
        },
        last_updated: '2024-01-01',
      };

      const yamlString = yaml.dump(validCourse);
      expect(() => parseCourse(yamlString)).toThrow(ValidationError);
    });

    it('should validate date formats', () => {
      const validCourse = {
        id: 'test-course',
        title: 'Test Course',
        type: 'course' as const,
        year: 2024,
        difficulty: 'beginner' as const,
        tags: ['test'],
        instructors: ['Test Instructor'],
        language: 'en' as const,
        summary: 'A test course for validation',
        sessions: [{
          id: 'session-1',
          title: 'Test Session',
          objectives: ['Learn testing'],
          materials: { references: [] }
        }],
        external_links: {},
        last_updated: 'invalid-date-format',
      };

      const yamlString = yaml.dump(validCourse);
      expect(() => parseCourse(yamlString)).toThrow(ValidationError);
    });
  });
});