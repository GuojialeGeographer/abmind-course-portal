import Fuse, { IFuseOptions, FuseResultMatch } from 'fuse.js';
import { Course, Resource, LearningPath } from '@/types';

// Search configuration for different content types
const courseSearchOptions: IFuseOptions<Course> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'summary', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'instructors', weight: 0.1 }
  ],
  threshold: 0.4, // Lower threshold = more strict matching
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};

const resourceSearchOptions: IFuseOptions<Resource> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.3 }
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};

const learningPathSearchOptions: IFuseOptions<LearningPath> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.4 },
    { name: 'recommended_audience', weight: 0.2 }
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};

export interface SearchResult<T> {
  item: T;
  score?: number;
  matches?: FuseResultMatch[];
}

export interface SearchResults {
  courses: SearchResult<Course>[];
  resources: SearchResult<Resource>[];
  learningPaths: SearchResult<LearningPath>[];
  totalCount: number;
}

export class SearchEngine {
  private courseFuse: Fuse<Course>;
  private resourceFuse: Fuse<Resource>;
  private learningPathFuse: Fuse<LearningPath>;

  constructor(
    courses: Course[] = [],
    resources: Resource[] = [],
    learningPaths: LearningPath[] = []
  ) {
    this.courseFuse = new Fuse(courses, courseSearchOptions);
    this.resourceFuse = new Fuse(resources, resourceSearchOptions);
    this.learningPathFuse = new Fuse(learningPaths, learningPathSearchOptions);
  }

  updateData(
    courses: Course[] = [],
    resources: Resource[] = [],
    learningPaths: LearningPath[] = []
  ) {
    this.courseFuse.setCollection(courses);
    this.resourceFuse.setCollection(resources);
    this.learningPathFuse.setCollection(learningPaths);
  }

  search(query: string): SearchResults {
    if (!query.trim()) {
      return {
        courses: [],
        resources: [],
        learningPaths: [],
        totalCount: 0
      };
    }

    const courseResults = this.courseFuse.search(query);
    const resourceResults = this.resourceFuse.search(query);
    const learningPathResults = this.learningPathFuse.search(query);

    const courses = courseResults.map(result => ({
      item: result.item,
      score: result.score ?? 0,
      matches: result.matches ? [...result.matches] : []
    }));

    const resources = resourceResults.map(result => ({
      item: result.item,
      score: result.score ?? 0,
      matches: result.matches ? [...result.matches] : []
    }));

    const learningPaths = learningPathResults.map(result => ({
      item: result.item,
      score: result.score ?? 0,
      matches: result.matches ? [...result.matches] : []
    }));

    return {
      courses,
      resources,
      learningPaths,
      totalCount: courses.length + resources.length + learningPaths.length
    };
  }
}

// Utility function to highlight search matches in text
export function highlightMatches(
  text: string,
  matches: FuseResultMatch[] = [],
  className: string = 'bg-yellow-200 font-semibold'
): string {
  if (!matches.length) return text;

  // Find matches for this specific text field
  const textMatches = matches.filter(match => 
    typeof match.value === 'string' && match.value === text
  );

  if (!textMatches.length) return text;

  let highlightedText = text;
  const highlights: Array<{ start: number; end: number }> = [];

  // Collect all highlight ranges
  textMatches.forEach(match => {
    if (match.indices) {
      match.indices.forEach(([start, end]) => {
        highlights.push({ start, end: end + 1 });
      });
    }
  });

  // Sort highlights by start position (descending) to avoid index shifting
  highlights.sort((a, b) => b.start - a.start);

  // Apply highlights from end to start
  highlights.forEach(({ start, end }) => {
    const before = highlightedText.slice(0, start);
    const highlighted = highlightedText.slice(start, end);
    const after = highlightedText.slice(end);
    highlightedText = `${before}<mark class="${className}">${highlighted}</mark>${after}`;
  });

  return highlightedText;
}

// URL search params utilities
export function getSearchParamsFromUrl(): { query: string } {
  if (typeof window === 'undefined') {
    return { query: '' };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get('q') || ''
  };
}

export function updateSearchParamsInUrl(query: string) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  
  if (query.trim()) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }

  // Update URL without triggering a page reload
  window.history.replaceState({}, '', url.toString());
}