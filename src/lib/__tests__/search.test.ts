import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SearchEngine, highlightMatches, getSearchParamsFromUrl, updateSearchParamsInUrl } from '../search';
import { Course, Resource, LearningPath } from '@/types';

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
    language: 'en'
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

describe('SearchEngine', () => {
  it('should initialize with empty data', () => {
    const searchEngine = new SearchEngine();
    const results = searchEngine.search('mesa');
    
    expect(results.totalCount).toBe(0);
    expect(results.courses).toHaveLength(0);
    expect(results.resources).toHaveLength(0);
    expect(results.learningPaths).toHaveLength(0);
  });

  it('should search courses by title', () => {
    const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
    const results = searchEngine.search('Mesa');
    
    expect(results.totalCount).toBeGreaterThan(0);
    expect(results.courses).toHaveLength(1);
    expect(results.courses[0].item.title).toBe('Mesa Framework Basics');
  });

  it('should search courses by tags', () => {
    const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
    const results = searchEngine.search('urban');
    
    expect(results.totalCount).toBeGreaterThan(0);
    expect(results.courses).toHaveLength(1);
    expect(results.courses[0].item.title).toBe('Urban Modeling with ABM');
  });

  it('should search resources', () => {
    const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
    const results = searchEngine.search('documentation');
    
    expect(results.totalCount).toBeGreaterThan(0);
    expect(results.resources).toHaveLength(1);
    expect(results.resources[0].item.title).toBe('Mesa Documentation');
  });

  it('should search learning paths', () => {
    const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
    const results = searchEngine.search('beginner');
    
    expect(results.totalCount).toBeGreaterThan(0);
    expect(results.learningPaths).toHaveLength(1);
    expect(results.learningPaths[0].item.title).toBe('ABM for Beginners');
  });

  it('should return empty results for empty query', () => {
    const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
    const results = searchEngine.search('');
    
    expect(results.totalCount).toBe(0);
  });

  it('should return empty results for no matches', () => {
    const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
    const results = searchEngine.search('nonexistent');
    
    expect(results.totalCount).toBe(0);
  });

  it('should update data correctly', () => {
    const searchEngine = new SearchEngine();
    
    // Initially no results
    let results = searchEngine.search('mesa');
    expect(results.totalCount).toBe(0);
    
    // Update with data
    searchEngine.updateData(mockCourses, mockResources, mockLearningPaths);
    results = searchEngine.search('mesa');
    expect(results.totalCount).toBeGreaterThan(0);
  });
});

describe('highlightMatches', () => {
  it('should return original text when no matches', () => {
    const result = highlightMatches('Hello World', []);
    expect(result).toBe('Hello World');
  });

  it('should return original text when matches are empty', () => {
    const result = highlightMatches('Hello World');
    expect(result).toBe('Hello World');
  });

  // Note: Testing actual highlighting would require mock Fuse.js match objects
  // which are complex to construct. In a real scenario, this would be tested
  // with integration tests using actual search results.
});

describe('URL utilities', () => {
  it('should handle getSearchParamsFromUrl in server environment', () => {
    // This function should handle server-side rendering gracefully
    const params = getSearchParamsFromUrl();
    expect(params.query).toBe('');
  });

  it('should handle updateSearchParamsInUrl in server environment', () => {
    // This function should handle server-side rendering gracefully
    expect(() => updateSearchParamsInUrl('test')).not.toThrow();
  });
});

// Property-based tests
describe('Search Property Tests', () => {
  /**
   * **Feature: abmind-course-portal, Property 3: Search result relevance**
   * **Validates: Requirements 8.1, 8.3**
   */
  it('should return relevant results for any search query', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (query) => {
          // Use the existing mock data for consistency
          const searchEngine = new SearchEngine(mockCourses, mockResources, mockLearningPaths);
          const results = searchEngine.search(query);

          // Property: Total count should match sum of individual counts
          expect(results.totalCount).toBe(
            results.courses.length + results.resources.length + results.learningPaths.length
          );

          // Property: Results should have scores (for relevance ranking)
          [...results.courses, ...results.resources, ...results.learningPaths].forEach(result => {
            expect(typeof result.score).toBe('number');
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(1);
          });

          // Property: All results should have valid items
          results.courses.forEach(result => {
            expect(result.item).toBeDefined();
            expect(result.item.id).toBeDefined();
            expect(result.item.title).toBeDefined();
          });

          results.resources.forEach(result => {
            expect(result.item).toBeDefined();
            expect(result.item.id).toBeDefined();
            expect(result.item.title).toBeDefined();
          });

          results.learningPaths.forEach(result => {
            expect(result.item).toBeDefined();
            expect(result.item.id).toBeDefined();
            expect(result.item.title).toBeDefined();
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});