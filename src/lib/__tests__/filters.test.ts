import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FilterEngine, FilterOptions, getFiltersFromUrl, updateFiltersInUrl, hasActiveFilters, clearAllFilters, getActiveFilterCount } from '../filters';
import { Course, Resource, LearningPath } from '@/types';

// Helper function to create complete FilterOptions
const createFilterOptions = (overrides: Partial<FilterOptions> = {}): FilterOptions => ({
  difficulty: [],
  tags: [],
  year: [],
  type: [],
  language: [],
  domains: [],
  ...overrides
});

// Mock data for testing
const mockCourses: Course[] = [
  {
    id: 'mesa-basics',
    title: 'Mesa Framework Basics',
    type: 'course',
    year: 2024,
    difficulty: 'beginner',
    tags: ['mesa', 'python', 'abm'],
    instructors: ['Dr. Smith'],
    language: 'zh',
    summary: 'Learn the fundamentals of Mesa framework for agent-based modeling',
    sessions: [],
    external_links: {},
    last_updated: '2024-01-01'
  },
  {
    id: 'urban-modeling',
    title: 'Urban Modeling with ABM',
    type: 'workshop',
    year: 2023,
    difficulty: 'intermediate',
    tags: ['urban', 'modeling', 'city'],
    instructors: ['Prof. Johnson'],
    language: 'en',
    summary: 'Advanced techniques for modeling urban systems using agent-based approaches',
    sessions: [],
    external_links: {},
    last_updated: '2023-12-01'
  },
  {
    id: 'advanced-abm',
    title: 'Advanced ABM Techniques',
    type: 'reading_group',
    year: 2024,
    difficulty: 'advanced',
    tags: ['advanced', 'research', 'abm'],
    instructors: ['Dr. Chen'],
    language: 'zh',
    summary: 'Cutting-edge research in agent-based modeling',
    sessions: [],
    external_links: {},
    last_updated: '2024-02-01'
  }
];

const mockResources: Resource[] = [
  {
    id: 'mesa-docs',
    title: 'Mesa Documentation',
    type: 'docs',
    url: 'https://mesa.readthedocs.io',
    tags: ['mesa', 'documentation'],
    description: 'Official Mesa framework documentation',
    language: 'en',
    difficulty: 'beginner'
  },
  {
    id: 'abm-tutorial',
    title: 'ABM Tutorial Series',
    type: 'tutorial',
    url: 'https://example.com/tutorial',
    tags: ['tutorial', 'abm', 'beginner'],
    description: 'Step-by-step tutorial for learning ABM',
    language: 'zh',
    difficulty: 'beginner'
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 'abm-beginner',
    title: 'ABM for Beginners',
    description: 'Complete learning path for ABM newcomers',
    recommended_audience: 'Beginners',
    estimated_duration: '4 weeks',
    steps: []
  }
];

describe('FilterEngine', () => {
  describe('filterCourses', () => {
    it('should filter courses by difficulty', () => {
      const filters = createFilterOptions({
        difficulty: ['beginner']
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe('beginner');
    });

    it('should filter courses by tags', () => {
      const filters = createFilterOptions({
        tags: ['urban']
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('urban');
    });

    it('should filter courses by year', () => {
      const filters = createFilterOptions({
        year: ['2024']
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(2);
      result.forEach(course => expect(course.year).toBe(2024));
    });

    it('should filter courses by type', () => {
      const filters = createFilterOptions({
        type: ['workshop']
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('workshop');
    });

    it('should filter courses by language', () => {
      const filters = createFilterOptions({
        language: ['zh']
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(2);
      result.forEach(course => expect(course.language).toBe('zh'));
    });

    it('should apply multiple filters', () => {
      const filters = createFilterOptions({
        difficulty: ['beginner'],
        year: ['2024'],
        language: ['zh']
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('mesa-basics');
    });

    it('should return empty array when no matches', () => {
      const filters = createFilterOptions({
        difficulty: ['expert'] // Non-existent difficulty
      });

      const result = FilterEngine.filterCourses(mockCourses, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('filterResources', () => {
    it('should filter resources by difficulty', () => {
      const filters = createFilterOptions({
        difficulty: ['beginner']
      });

      const result = FilterEngine.filterResources(mockResources, filters);
      expect(result).toHaveLength(2);
      result.forEach(resource => expect(resource.difficulty).toBe('beginner'));
    });

    it('should filter resources by tags', () => {
      const filters = createFilterOptions({
        tags: ['mesa']
      });

      const result = FilterEngine.filterResources(mockResources, filters);
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('mesa');
    });

    it('should filter resources by type', () => {
      const filters = createFilterOptions({
        type: ['docs']
      });

      const result = FilterEngine.filterResources(mockResources, filters);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('docs');
    });

    it('should filter resources by language', () => {
      const filters = createFilterOptions({
        language: ['zh']
      });

      const result = FilterEngine.filterResources(mockResources, filters);
      expect(result).toHaveLength(1);
      expect(result[0].language).toBe('zh');
    });
  });

  describe('filterLearningPaths', () => {
    it('should filter learning paths by tags in description', () => {
      const filters = createFilterOptions({
        tags: ['beginner']
      });

      const result = FilterEngine.filterLearningPaths(mockLearningPaths, filters);
      expect(result).toHaveLength(1);
      expect(result[0].recommended_audience.toLowerCase()).toContain('beginner');
    });

    it('should return empty array when no matches', () => {
      const filters = createFilterOptions({
        tags: ['nonexistent']
      });

      const result = FilterEngine.filterLearningPaths(mockLearningPaths, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAvailableFilters', () => {
    it('should extract all available filter options', () => {
      const available = FilterEngine.getAvailableFilters(mockCourses, mockResources, mockLearningPaths);

      expect(available.difficulty).toContain('beginner');
      expect(available.difficulty).toContain('intermediate');
      expect(available.difficulty).toContain('advanced');

      expect(available.tags).toContain('mesa');
      expect(available.tags).toContain('urban');
      expect(available.tags).toContain('abm');

      expect(available.year).toContain('2024');
      expect(available.year).toContain('2023');

      expect(available.type).toContain('course');
      expect(available.type).toContain('workshop');
      expect(available.type).toContain('docs');

      expect(available.language).toContain('zh');
      expect(available.language).toContain('en');
    });

    it('should sort years in descending order', () => {
      const available = FilterEngine.getAvailableFilters(mockCourses, mockResources, mockLearningPaths);
      expect(available.year[0]).toBe('2024');
      expect(available.year[1]).toBe('2023');
    });
  });
});

describe('Filter utilities', () => {
  describe('hasActiveFilters', () => {
    it('should return false for empty filters', () => {
      const filters = clearAllFilters();
      expect(hasActiveFilters(filters)).toBe(false);
    });

    it('should return true when filters are active', () => {
      const filters = createFilterOptions({
        difficulty: ['beginner']
      });
      expect(hasActiveFilters(filters)).toBe(true);
    });
  });

  describe('getActiveFilterCount', () => {
    it('should count active filters correctly', () => {
      const filters = createFilterOptions({
        difficulty: ['beginner', 'intermediate'],
        tags: ['mesa']
      });
      expect(getActiveFilterCount(filters)).toBe(3);
    });

    it('should return 0 for empty filters', () => {
      const filters = clearAllFilters();
      expect(getActiveFilterCount(filters)).toBe(0);
    });
  });

  describe('URL utilities', () => {
    it('should handle getFiltersFromUrl in server environment', () => {
      const filters = getFiltersFromUrl();
      expect(filters.difficulty).toEqual([]);
      expect(filters.tags).toEqual([]);
      expect(filters.year).toEqual([]);
      expect(filters.type).toEqual([]);
      expect(filters.language).toEqual([]);
      expect(filters.domains).toEqual([]);
    });

    it('should handle updateFiltersInUrl in server environment', () => {
      const filters = clearAllFilters();
      expect(() => updateFiltersInUrl(filters)).not.toThrow();
    });
  });
});

// Property-based tests
describe('Filter Property Tests', () => {
  /**
   * **Feature: abmind-course-portal, Property 4: Filter consistency**
   * **Validates: Requirements 2.2, 8.2, 8.5**
   */
  it('should maintain filter consistency across all operations', () => {
    fc.assert(
      fc.property(
        // Generate filter options
        fc.record({
          difficulty: fc.array(fc.constantFrom('beginner', 'intermediate', 'advanced'), { maxLength: 3 }),
          tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
          year: fc.array(fc.integer({ min: 2020, max: 2030 }).map(String), { maxLength: 3 }),
          type: fc.array(fc.constantFrom('course', 'workshop', 'reading_group', 'docs', 'tutorial'), { maxLength: 5 }),
          language: fc.array(fc.constantFrom('zh', 'en'), { maxLength: 2 }),
          domains: fc.array(fc.constantFrom('urban', 'environmental', 'transportation', 'social', 'economics', 'computational'), { maxLength: 3 })
        }),
        (filters) => {
          // Property: Filtered results should only contain items matching ALL active filters
          const filteredCourses = FilterEngine.filterCourses(mockCourses, filters);
          const filteredResources = FilterEngine.filterResources(mockResources, filters);
          const _filteredLearningPaths = FilterEngine.filterLearningPaths(mockLearningPaths, filters);

          // Check courses
          filteredCourses.forEach(course => {
            // If difficulty filter is active, course must match
            if (filters.difficulty.length > 0) {
              expect(filters.difficulty).toContain(course.difficulty);
            }

            // If year filter is active, course must match
            if (filters.year.length > 0) {
              expect(filters.year).toContain(course.year.toString());
            }

            // If type filter is active, course must match
            if (filters.type.length > 0) {
              expect(filters.type).toContain(course.type);
            }

            // If language filter is active, course must match
            if (filters.language.length > 0) {
              expect(filters.language).toContain(course.language);
            }

            // If tags filter is active, course must have at least one matching tag
            if (filters.tags.length > 0) {
              const hasMatchingTag = filters.tags.some(filterTag =>
                course.tags.some(courseTag =>
                  courseTag.toLowerCase().includes(filterTag.toLowerCase())
                )
              );
              expect(hasMatchingTag).toBe(true);
            }
          });

          // Check resources (suppress unused variable warning)
          filteredResources.forEach(resource => {
            // If difficulty filter is active and resource has difficulty, it must match
            if (filters.difficulty.length > 0 && resource.difficulty) {
              expect(filters.difficulty).toContain(resource.difficulty);
            }

            // If type filter is active, resource must match
            if (filters.type.length > 0) {
              expect(filters.type).toContain(resource.type);
            }

            // If language filter is active, resource must match
            if (filters.language.length > 0) {
              expect(filters.language).toContain(resource.language);
            }

            // If tags filter is active, resource must have at least one matching tag
            if (filters.tags.length > 0) {
              const hasMatchingTag = filters.tags.some(filterTag =>
                resource.tags.some(resourceTag =>
                  resourceTag.toLowerCase().includes(filterTag.toLowerCase())
                )
              );
              expect(hasMatchingTag).toBe(true);
            }
          });

          // Property: hasActiveFilters should correctly identify active filters
          const expectedHasActive = Object.values(filters).some(filterArray => filterArray.length > 0);
          expect(hasActiveFilters(filters)).toBe(expectedHasActive);

          // Property: getActiveFilterCount should return correct count
          const expectedCount = Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
          expect(getActiveFilterCount(filters)).toBe(expectedCount);

          // Property: clearAllFilters should result in empty filters
          const clearedFilters = clearAllFilters();
          expect(hasActiveFilters(clearedFilters)).toBe(false);
          expect(getActiveFilterCount(clearedFilters)).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});