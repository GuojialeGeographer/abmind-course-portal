import '@testing-library/jest-dom';

// Mock performance API for tests
const mockPerformance = {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
  getEntriesByType: () => [],
  getEntriesByName: () => [],
};

// @ts-ignore
global.performance = mockPerformance;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '0px';
  thresholds = [0];
  
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;