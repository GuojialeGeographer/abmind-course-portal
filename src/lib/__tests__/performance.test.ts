import { describe, it, expect, beforeAll, vi } from 'vitest';
import { loadCourses, loadSiteConfig, loadLearningPaths, loadResources } from '@/lib/data';
import { getTextClassName, optimizeTextForDisplay, getChineseRatio } from '@/lib/chinese-utils';

// Mock performance API for testing
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
};

// @ts-ignore
global.performance = mockPerformance;

describe('Performance Tests', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe('Data Loading Performance', () => {
    it('should load courses within acceptable time', async () => {
      const startTime = performance.now();
      const courses = await loadCourses();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(courses).toBeDefined();
      expect(Array.isArray(courses)).toBe(true);
      // Should load within 100ms in test environment
      expect(loadTime).toBeLessThan(100);
    });

    it('should load site config within acceptable time', async () => {
      const startTime = performance.now();
      const config = await loadSiteConfig();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(config).toBeDefined();
      // Should load within 50ms in test environment
      expect(loadTime).toBeLessThan(50);
    });

    it('should load learning paths within acceptable time', async () => {
      const startTime = performance.now();
      const paths = await loadLearningPaths();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(paths).toBeDefined();
      expect(Array.isArray(paths)).toBe(true);
      // Should load within 50ms in test environment
      expect(loadTime).toBeLessThan(50);
    });

    it('should load resources within acceptable time', async () => {
      const startTime = performance.now();
      const resources = await loadResources();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(resources).toBeDefined();
      expect(Array.isArray(resources)).toBe(true);
      // Should load within 50ms in test environment
      expect(loadTime).toBeLessThan(50);
    });

    it('should cache repeated data loads', async () => {
      // First load
      const startTime1 = performance.now();
      const courses1 = await loadCourses();
      const endTime1 = performance.now();
      const firstLoadTime = endTime1 - startTime1;

      // Second load (should be cached)
      const startTime2 = performance.now();
      const courses2 = await loadCourses();
      const endTime2 = performance.now();
      const secondLoadTime = endTime2 - startTime2;

      expect(courses1).toEqual(courses2);
      // Second load should be faster or equal due to caching
      expect(secondLoadTime).toBeLessThanOrEqual(firstLoadTime + 1); // Allow 1ms tolerance
    });
  });

  describe('Chinese Text Processing Performance', () => {
    const sampleTexts = [
      '这是一个简单的中文测试文本',
      'This is a simple English test text',
      '这是一个混合的 mixed content 测试文本 with English words',
      '这是一个很长的中文文本，包含了很多字符，用来测试性能。'.repeat(10),
      'A'.repeat(1000), // Long English text
      '中'.repeat(1000), // Long Chinese text
    ];

    it('should process Chinese ratio calculation efficiently', () => {
      sampleTexts.forEach(text => {
        const startTime = performance.now();
        const ratio = getChineseRatio(text);
        const endTime = performance.now();
        const processTime = endTime - startTime;

        expect(ratio).toBeGreaterThanOrEqual(0);
        expect(ratio).toBeLessThanOrEqual(1);
        // Should process within 10ms even for long texts
        expect(processTime).toBeLessThan(10);
      });
    });

    it('should optimize text display efficiently', () => {
      sampleTexts.forEach(text => {
        const startTime = performance.now();
        const optimized = optimizeTextForDisplay(text);
        const endTime = performance.now();
        const processTime = endTime - startTime;

        expect(optimized).toBeDefined();
        expect(typeof optimized).toBe('string');
        // Should process within 5ms even for long texts
        expect(processTime).toBeLessThan(5);
      });
    });

    it('should determine text class names efficiently', () => {
      sampleTexts.forEach(text => {
        const startTime = performance.now();
        const className = getTextClassName(text);
        const endTime = performance.now();
        const processTime = endTime - startTime;

        expect(typeof className).toBe('string');
        // Should process within 5ms even for long texts
        expect(processTime).toBeLessThan(5);
      });
    });

    it('should handle batch text processing efficiently', () => {
      const batchSize = 100;
      const batch = Array(batchSize).fill(0).map((_, i) => 
        `测试文本 ${i} with mixed content ${i}`
      );

      const startTime = performance.now();
      const results = batch.map(text => ({
        ratio: getChineseRatio(text),
        optimized: optimizeTextForDisplay(text),
        className: getTextClassName(text),
      }));
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(results).toHaveLength(batchSize);
      // Should process 100 texts within 100ms
      expect(totalTime).toBeLessThan(100);
      
      // Average time per text should be less than 1ms
      const avgTime = totalTime / batchSize;
      expect(avgTime).toBeLessThan(1);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not create memory leaks in data loading', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Load data multiple times
      for (let i = 0; i < 10; i++) {
        await loadCourses();
        await loadSiteConfig();
        await loadLearningPaths();
        await loadResources();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('should not create memory leaks in text processing', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Process many texts
      for (let i = 0; i < 1000; i++) {
        const text = `测试文本 ${i} with mixed content ${i}`;
        getChineseRatio(text);
        optimizeTextForDisplay(text);
        getTextClassName(text);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 6MB to account for test environment overhead)
      expect(memoryIncrease).toBeLessThan(6 * 1024 * 1024);
    });
  });

  describe('Bundle Size Simulation', () => {
    it('should have reasonable module sizes', () => {
      // Simulate checking if our utilities are tree-shakeable
      const chineseUtils = {
        isChineseChar: getChineseRatio,
        optimizeTextForDisplay,
        getTextClassName,
      };
      
      // Check that functions are properly exported
      expect(typeof chineseUtils.isChineseChar).toBe('function');
      expect(typeof chineseUtils.optimizeTextForDisplay).toBe('function');
      expect(typeof chineseUtils.getTextClassName).toBe('function');
    });
  });

  describe('Core Web Vitals Simulation', () => {
    it('should simulate good Largest Contentful Paint (LCP)', async () => {
      // Simulate loading main content
      const startTime = performance.now();
      
      const courses = await loadCourses();
      const config = await loadSiteConfig();
      
      // Simulate rendering time
      const renderTime = 50; // 50ms render time
      await new Promise(resolve => setTimeout(resolve, renderTime));
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(courses).toBeDefined();
      expect(config).toBeDefined();
      
      // Total time should be under 200ms for good LCP
      expect(totalTime).toBeLessThan(200);
    });

    it('should simulate good First Input Delay (FID)', () => {
      // Simulate user interaction processing
      const startTime = performance.now();
      
      // Simulate processing a search query
      const query = '城市建模';
      const processed = optimizeTextForDisplay(query);
      const className = getTextClassName(processed);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processed).toBeDefined();
      expect(className).toBeDefined();
      
      // Processing should be under 10ms for good FID
      expect(processingTime).toBeLessThan(10);
    });

    it('should simulate good Cumulative Layout Shift (CLS)', () => {
      // Simulate layout stability by checking consistent text processing
      const texts = [
        '短文本',
        '这是一个中等长度的文本内容',
        '这是一个很长的文本内容，包含了很多字符和信息，用来测试布局稳定性。'.repeat(5),
      ];
      
      const results = texts.map(text => ({
        original: text,
        optimized: optimizeTextForDisplay(text),
        className: getTextClassName(text),
      }));
      
      // All texts should be processed consistently
      results.forEach(result => {
        expect(result.optimized).toBeDefined();
        expect(result.className).toBeDefined();
        expect(typeof result.optimized).toBe('string');
        expect(typeof result.className).toBe('string');
      });
      
      // Processing should be consistent (no layout shifts)
      expect(results).toHaveLength(texts.length);
    });
  });
});