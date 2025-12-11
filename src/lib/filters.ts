import { Course, Resource, LearningPath, Domain } from '@/types';
import { DomainDetector } from './domains';

// Filter utilities for courses, resources, and learning paths

export interface FilterOptions {
  difficulty: string[];
  tags: string[];
  year: string[];
  type: string[];
  language: string[];
  domains: string[];
}

export interface FilteredResults<T> {
  items: T[];
  totalCount: number;
  appliedFilters: FilterOptions;
}

export class FilterEngine {
  // Filter courses based on filter criteria
  static filterCourses(courses: Course[], filters: FilterOptions): Course[] {
    return courses.filter(course => {
      // Filter by difficulty
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(course.difficulty)) {
        return false;
      }

      // Filter by tags (course must have at least one matching tag)
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          course.tags.some(courseTag => 
            courseTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by year
      if (filters.year.length > 0 && !filters.year.includes(course.year.toString())) {
        return false;
      }

      // Filter by type
      if (filters.type.length > 0 && !filters.type.includes(course.type)) {
        return false;
      }

      // Filter by language
      if (filters.language.length > 0 && !filters.language.includes(course.language)) {
        return false;
      }

      // Filter by domains
      if (filters.domains.length > 0) {
        const courseDomains = DomainDetector.detectCourseDomains(course);
        const hasMatchingDomain = filters.domains.some(domain => 
          courseDomains.includes(domain as Domain)
        );
        if (!hasMatchingDomain) return false;
      }

      return true;
    });
  }

  // Filter resources based on filter criteria
  static filterResources(resources: Resource[], filters: FilterOptions): Resource[] {
    return resources.filter(resource => {
      // Filter by difficulty (if resource has difficulty)
      if (filters.difficulty.length > 0 && resource.difficulty && 
          !filters.difficulty.includes(resource.difficulty)) {
        return false;
      }

      // Filter by tags
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          resource.tags.some(resourceTag => 
            resourceTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by type
      if (filters.type.length > 0 && !filters.type.includes(resource.type)) {
        return false;
      }

      // Filter by language
      if (filters.language.length > 0 && !filters.language.includes(resource.language)) {
        return false;
      }

      // Filter by domains
      if (filters.domains.length > 0) {
        const resourceDomains = DomainDetector.detectResourceDomains(resource);
        const hasMatchingDomain = filters.domains.some(domain => 
          resourceDomains.includes(domain as Domain)
        );
        if (!hasMatchingDomain) return false;
      }

      return true;
    });
  }

  // Filter learning paths based on filter criteria
  static filterLearningPaths(learningPaths: LearningPath[], filters: FilterOptions): LearningPath[] {
    return learningPaths.filter(path => {
      // Filter by tags (check if any filter tag matches path description or title)
      if (filters.tags.length > 0) {
        const searchableText = `${path.title} ${path.description} ${path.recommended_audience}`.toLowerCase();
        const hasMatchingTag = filters.tags.some(tag => 
          searchableText.includes(tag.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }

  // Get all available filter options from data
  static getAvailableFilters(
    courses: Course[], 
    resources: Resource[], 
    _learningPaths: LearningPath[]
  ): FilterOptions {
    const difficulties = new Set<string>();
    const tags = new Set<string>();
    const years = new Set<string>();
    const types = new Set<string>();
    const languages = new Set<string>();
    const domains = new Set<string>();

    // Extract from courses
    courses.forEach(course => {
      difficulties.add(course.difficulty);
      course.tags.forEach(tag => tags.add(tag));
      years.add(course.year.toString());
      types.add(course.type);
      languages.add(course.language);
      
      // Extract domains
      const courseDomains = DomainDetector.detectCourseDomains(course);
      courseDomains.forEach(domain => domains.add(domain));
    });

    // Extract from resources
    resources.forEach(resource => {
      if (resource.difficulty) {
        difficulties.add(resource.difficulty);
      }
      resource.tags.forEach(tag => tags.add(tag));
      types.add(resource.type);
      languages.add(resource.language);
      
      // Extract domains
      const resourceDomains = DomainDetector.detectResourceDomains(resource);
      resourceDomains.forEach(domain => domains.add(domain));
    });

    return {
      difficulty: Array.from(difficulties).sort(),
      tags: Array.from(tags).sort(),
      year: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)), // Most recent first
      type: Array.from(types).sort(),
      language: Array.from(languages).sort(),
      domains: Array.from(domains).sort()
    };
  }
}

// URL parameter utilities for filter persistence
export function getFiltersFromUrl(): FilterOptions {
  if (typeof window === 'undefined') {
    return {
      difficulty: [],
      tags: [],
      year: [],
      type: [],
      language: [],
      domains: []
    };
  }

  const params = new URLSearchParams(window.location.search);
  
  return {
    difficulty: params.get('difficulty')?.split(',').filter(Boolean) || [],
    tags: params.get('tags')?.split(',').filter(Boolean) || [],
    year: params.get('year')?.split(',').filter(Boolean) || [],
    type: params.get('type')?.split(',').filter(Boolean) || [],
    language: params.get('language')?.split(',').filter(Boolean) || [],
    domains: params.get('domains')?.split(',').filter(Boolean) || []
  };
}

export function updateFiltersInUrl(filters: FilterOptions) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  
  // Update or remove filter parameters
  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      url.searchParams.set(key, values.join(','));
    } else {
      url.searchParams.delete(key);
    }
  });

  // Update URL without triggering a page reload
  window.history.replaceState({}, '', url.toString());
}

// Check if any filters are active
export function hasActiveFilters(filters: FilterOptions): boolean {
  return Object.values(filters).some(filterArray => filterArray.length > 0);
}

// Clear all filters
export function clearAllFilters(): FilterOptions {
  return {
    difficulty: [],
    tags: [],
    year: [],
    type: [],
    language: [],
    domains: []
  };
}

// Count total active filters
export function getActiveFilterCount(filters: FilterOptions): number {
  return Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
}