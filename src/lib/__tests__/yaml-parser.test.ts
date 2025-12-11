import { describe, it, expect } from 'vitest';
import {
  parseYAML,
  validateData,
  parseCourse,
  parseLearningPath,
  parseResource,
  parseSiteConfig,
  formatValidationError,
  isValidYAML,
  safeParseYAML,
  YAMLParseError,
  ValidationError,
} from '../yaml-parser';
import {
  CourseSchema,
  LearningPathSchema,
  ResourceSchema,
  SiteConfigSchema,
} from '../schemas';

describe('YAML Parser Unit Tests', () => {
  describe('parseYAML', () => {
    it('should parse valid YAML content', () => {
      const yamlContent = `
        name: test
        value: 123
        items:
          - item1
          - item2
      `;
      
      const result = parseYAML(yamlContent);
      expect(result).toEqual({
        name: 'test',
        value: 123,
        items: ['item1', 'item2']
      });
    });

    it('should throw YAMLParseError for invalid YAML', () => {
      const invalidYaml = 'invalid: yaml: [unclosed';
      
      expect(() => parseYAML(invalidYaml)).toThrow(YAMLParseError);
      expect(() => parseYAML(invalidYaml)).toThrow('Failed to parse YAML');
    });

    it('should handle empty YAML content', () => {
      expect(parseYAML('')).toBeUndefined();
      expect(parseYAML('null')).toBeNull();
    });
  });

  describe('validateData', () => {
    it('should validate data against schema successfully', () => {
      const validCourse = {
        id: 'test-course',
        title: 'Test Course',
        type: 'course',
        year: 2024,
        difficulty: 'beginner',
        tags: ['test'],
        instructors: ['Test Instructor'],
        language: 'en',
        summary: 'A test course',
        sessions: [{
          id: 'session-1',
          title: 'Test Session',
          objectives: ['Learn testing'],
          materials: { references: [] }
        }],
        external_links: {},
        last_updated: '2024-01-01',
      };

      const result = validateData(validCourse, CourseSchema);
      expect(result).toEqual(validCourse);
    });

    it('should throw ValidationError for invalid data', () => {
      const invalidCourse = {
        id: '',
        title: 'Test Course',
        // Missing required fields
      };

      expect(() => validateData(invalidCourse, CourseSchema)).toThrow(ValidationError);
    });
  });

  describe('parseCourse', () => {
    it('should parse valid course YAML', () => {
      const courseYaml = `
        id: 'test-course'
        title: 'Test Course'
        type: 'course'
        year: 2024
        difficulty: 'beginner'
        tags: ['test']
        instructors: ['Test Instructor']
        language: 'en'
        summary: 'A test course for validation'
        sessions:
          - id: 'session-1'
            title: 'Test Session'
            objectives: ['Learn testing']
            materials:
              references: []
        external_links: {}
        last_updated: '2024-01-01'
      `;

      const course = parseCourse(courseYaml);
      expect(course.id).toBe('test-course');
      expect(course.title).toBe('Test Course');
      expect(course.sessions).toHaveLength(1);
    });

    it('should throw error for invalid course YAML', () => {
      const invalidCourseYaml = `
        id: 'test-course'
        title: ''
        type: 'invalid-type'
      `;

      expect(() => parseCourse(invalidCourseYaml)).toThrow(ValidationError);
    });
  });

  describe('parseLearningPath', () => {
    it('should parse valid learning path YAML', () => {
      const pathYaml = `
        id: 'test-path'
        title: 'Test Learning Path'
        description: 'A test learning path for validation'
        recommended_audience: 'Test audience'
        estimated_duration: '4 weeks'
        steps:
          - order: 1
            type: 'course'
            course_id: 'test-course'
            note: 'Test step'
            optional: false
      `;

      const path = parseLearningPath(pathYaml);
      expect(path.id).toBe('test-path');
      expect(path.title).toBe('Test Learning Path');
      expect(path.steps).toHaveLength(1);
      expect(path.steps[0].type).toBe('course');
    });

    it('should validate step type constraints', () => {
      const invalidPathYaml = `
        id: 'test-path'
        title: 'Test Learning Path'
        description: 'A test learning path'
        recommended_audience: 'Test audience'
        estimated_duration: '4 weeks'
        steps:
          - order: 1
            type: 'course'
            note: 'Missing course_id'
            optional: false
      `;

      expect(() => parseLearningPath(invalidPathYaml)).toThrow(ValidationError);
    });
  });

  describe('parseResource', () => {
    it('should parse valid resource YAML', () => {
      const resourceYaml = `
        id: 'test-resource'
        title: 'Test Resource'
        type: 'docs'
        url: 'https://example.com/resource'
        tags: ['test', 'documentation']
        description: 'A test resource for validation'
        language: 'en'
        difficulty: 'beginner'
      `;

      const resource = parseResource(resourceYaml);
      expect(resource.id).toBe('test-resource');
      expect(resource.title).toBe('Test Resource');
      expect(resource.type).toBe('docs');
      expect(resource.url).toBe('https://example.com/resource');
    });

    it('should validate URL format', () => {
      const invalidResourceYaml = `
        id: 'test-resource'
        title: 'Test Resource'
        type: 'docs'
        url: 'not-a-valid-url'
        tags: ['test']
        description: 'A test resource'
        language: 'en'
      `;

      expect(() => parseResource(invalidResourceYaml)).toThrow(ValidationError);
    });
  });

  describe('parseSiteConfig', () => {
    it('should parse valid site config YAML', () => {
      const configYaml = `
        site_info:
          title: 'Test Site'
          description: 'A test site configuration'
          url: 'https://example.com'
          social_links:
            - name: 'GitHub'
              url: 'https://github.com/test'
              icon: 'github'
        navigation:
          - label: 'Home'
            href: '/'
        featured_courses: []
        announcements: []
      `;

      const config = parseSiteConfig(configYaml);
      expect(config.site_info.title).toBe('Test Site');
      expect(config.navigation).toHaveLength(1);
      expect(config.site_info.social_links).toHaveLength(1);
    });

    it('should validate navigation structure', () => {
      const invalidConfigYaml = `
        site_info:
          title: 'Test Site'
          description: 'A test site'
          url: 'https://example.com'
          social_links: []
        navigation: []
        featured_courses: []
        announcements: []
      `;

      expect(() => parseSiteConfig(invalidConfigYaml)).toThrow(ValidationError);
    });
  });

  describe('Error Handling Utilities', () => {
    it('should format validation errors correctly', () => {
      const invalidData = { id: '', title: 'Test' };
      
      try {
        validateData(invalidData, CourseSchema);
      } catch (error) {
        if (error instanceof ValidationError) {
          const formatted = formatValidationError(error);
          expect(formatted).toContain('Validation failed');
          expect(formatted).toContain('id:');
        }
      }
    });

    it('should check YAML validity', () => {
      expect(isValidYAML('name: test')).toBe(true);
      expect(isValidYAML('invalid: yaml: [unclosed')).toBe(false);
      expect(isValidYAML('')).toBe(true); // Empty is valid YAML (null)
    });

    it('should safely parse YAML with error handling', () => {
      const validYaml = 'name: test';
      const invalidYaml = 'invalid: yaml: [unclosed';
      
      const validResult = safeParseYAML(validYaml, CourseSchema);
      expect(validResult.success).toBe(false); // Will fail schema validation
      
      const invalidResult = safeParseYAML(invalidYaml, CourseSchema);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error).toContain('Failed to parse YAML');
    });
  });

  describe('Data Transformation', () => {
    it('should handle optional fields correctly', () => {
      const courseWithOptionals = `
        id: 'test-course'
        title: 'Test Course'
        type: 'course'
        year: 2024
        difficulty: 'beginner'
        tags: ['test']
        instructors: ['Test Instructor']
        language: 'en'
        summary: 'A test course'
        sessions:
          - id: 'session-1'
            title: 'Test Session'
            objectives: ['Learn testing']
            materials:
              slides: 'https://example.com/slides.pdf'
              code_repo: 'https://github.com/test/repo'
              references: []
        external_links:
          course_page: 'https://example.com/course'
        last_updated: '2024-01-01'
      `;

      const course = parseCourse(courseWithOptionals);
      expect(course.sessions[0].materials.slides).toBe('https://example.com/slides.pdf');
      expect(course.sessions[0].materials.code_repo).toBe('https://github.com/test/repo');
      expect(course.external_links.course_page).toBe('https://example.com/course');
    });

    it('should handle missing optional fields', () => {
      const courseMinimal = `
        id: 'minimal-course'
        title: 'Minimal Course'
        type: 'course'
        year: 2024
        difficulty: 'beginner'
        tags: ['minimal']
        instructors: ['Test Instructor']
        language: 'en'
        summary: 'A minimal test course'
        sessions:
          - id: 'session-1'
            title: 'Test Session'
            objectives: ['Learn testing']
            materials:
              references: []
        external_links: {}
        last_updated: '2024-01-01'
      `;

      const course = parseCourse(courseMinimal);
      expect(course.sessions[0].materials.slides).toBeUndefined();
      expect(course.sessions[0].materials.code_repo).toBeUndefined();
      expect(course.external_links.course_page).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle Chinese characters in content', () => {
      const chineseCourse = `
        id: 'chinese-course'
        title: '中文课程测试'
        type: 'course'
        year: 2024
        difficulty: 'beginner'
        tags: ['中文', '测试']
        instructors: ['张老师']
        language: 'zh'
        summary: '这是一个中文课程的测试'
        sessions:
          - id: 'session-1'
            title: '第一节课'
            objectives: ['学习中文内容']
            materials:
              references: []
        external_links: {}
        last_updated: '2024-01-01'
      `;

      const course = parseCourse(chineseCourse);
      expect(course.title).toBe('中文课程测试');
      expect(course.tags).toContain('中文');
      expect(course.instructors[0]).toBe('张老师');
    });

    it('should validate year constraints', () => {
      const futureCourse = `
        id: 'future-course'
        title: 'Future Course'
        type: 'course'
        year: 2030
        difficulty: 'beginner'
        tags: ['future']
        instructors: ['Future Instructor']
        language: 'en'
        summary: 'A course from the future'
        sessions:
          - id: 'session-1'
            title: 'Future Session'
            objectives: ['Learn future tech']
            materials:
              references: []
        external_links: {}
        last_updated: '2024-01-01'
      `;

      // Should not throw for reasonable future years
      expect(() => parseCourse(futureCourse)).not.toThrow();

      const tooFutureCourse = futureCourse.replace('year: 2030', 'year: 3000');
      expect(() => parseCourse(tooFutureCourse)).toThrow(ValidationError);
    });

    it('should validate date format strictly', () => {
      const invalidDateCourse = `
        id: 'invalid-date-course'
        title: 'Invalid Date Course'
        type: 'course'
        year: 2024
        difficulty: 'beginner'
        tags: ['test']
        instructors: ['Test Instructor']
        language: 'en'
        summary: 'Course with invalid date'
        sessions:
          - id: 'session-1'
            title: 'Test Session'
            objectives: ['Learn testing']
            materials:
              references: []
        external_links: {}
        last_updated: '2024/01/01'
      `;

      expect(() => parseCourse(invalidDateCourse)).toThrow(ValidationError);
    });
  });
});