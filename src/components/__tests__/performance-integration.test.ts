import { describe, it, expect, beforeEach, vi } from 'vitest';
import { measureSync, measureAsync, getPerformanceMonitor } from '@/lib/performance';
import { getTextClassName, optimizeTextForDisplay, getChineseRatio } from '@/lib/chinese-utils';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
};

// @ts-ignore
global.performance = mockPerformance;

describe('Performance Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPerformanceMonitor().clearMetrics();
  });

  describe('Text Processing Performance', () => {
    it('should process text classification efficiently', () => {
      const texts = [
        '这是中文文本',
        'This is English text',
        '这是混合 mixed content 文本',
      ];

      const startTime = performance.now();
      
      const results = texts.map(text => ({
        text,
        className: getTextClassName(text),
        optimized: optimizeTextForDisplay(text),
        ratio: getChineseRatio(text),
      }));
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should process all texts within 10ms
      expect(processingTime).toBeLessThan(10);
      
      // Verify all texts are processed
      expect(results).toHaveLength(texts.length);
      results.forEach(result => {
        expect(result.className).toBeDefined();
        expect(result.optimized).toBeDefined();
        expect(result.ratio).toBeGreaterThanOrEqual(0);
        expect(result.ratio).toBeLessThanOrEqual(1);
      });
    });

    it('should handle large text processing efficiently', () => {
      const longText = '这是一个很长的中文文本。'.repeat(100);
      
      const startTime = performance.now();
      const className = getTextClassName(longText);
      const optimized = optimizeTextForDisplay(longText);
      const ratio = getChineseRatio(longText);
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should process even long text within 20ms
      expect(processingTime).toBeLessThan(20);
      expect(className).toBeDefined();
      expect(optimized).toBeDefined();
      expect(ratio).toBeGreaterThan(0.8); // Should be mostly Chinese
    });

    it('should process mixed content efficiently', () => {
      const mixedTexts = [
        '这是一个中文段落，包含了很多文字内容。',
        'This is an English paragraph with lots of content.',
        '这是一个混合的 mixed content 段落 with both languages.',
      ];

      const startTime = performance.now();
      
      const results = mixedTexts.map(text => ({
        original: text,
        optimized: optimizeTextForDisplay(text),
        className: getTextClassName(text),
      }));
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Should process all mixed content within 15ms
      expect(processingTime).toBeLessThan(15);
      
      // Verify processing results
      expect(results).toHaveLength(mixedTexts.length);
      results.forEach(result => {
        expect(result.optimized).toBeDefined();
        expect(result.className).toBeDefined();
        expect(typeof result.optimized).toBe('string');
        expect(typeof result.className).toBe('string');
      });
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should measure synchronous operations correctly', () => {
      const result = measureSync('TEST_SYNC', () => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      });

      expect(result).toBe(499500); // Sum of 0 to 999
      
      const metrics = getPerformanceMonitor().getMetrics();
      const testMetric = metrics.find(m => m.name === 'TEST_SYNC');
      
      expect(testMetric).toBeDefined();
      expect(testMetric?.value).toBeGreaterThanOrEqual(0);
      expect(testMetric?.rating).toBeOneOf(['good', 'needs-improvement', 'poor']);
    });

    it('should measure asynchronous operations correctly', async () => {
      const result = await measureAsync('TEST_ASYNC', async () => {
        // Simulate async work
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'completed';
      });

      expect(result).toBe('completed');
      
      const metrics = getPerformanceMonitor().getMetrics();
      const testMetric = metrics.find(m => m.name === 'TEST_ASYNC');
      
      expect(testMetric).toBeDefined();
      expect(testMetric?.value).toBeGreaterThanOrEqual(10);
      expect(testMetric?.rating).toBeOneOf(['good', 'needs-improvement', 'poor']);
    });

    it('should handle errors in measured operations', async () => {
      try {
        await measureAsync('TEST_ERROR', async () => {
          throw new Error('Test error');
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      
      const metrics = getPerformanceMonitor().getMetrics();
      const errorMetric = metrics.find(m => m.name === 'TEST_ERROR_ERROR');
      
      expect(errorMetric).toBeDefined();
      expect(errorMetric?.value).toBeGreaterThanOrEqual(0);
    });

    it('should generate performance reports', () => {
      // Record some test metrics
      getPerformanceMonitor().recordMetric('GOOD_METRIC', 50);
      getPerformanceMonitor().recordMetric('POOR_METRIC', 5000);
      getPerformanceMonitor().recordMetric('NEEDS_IMPROVEMENT_METRIC', 200);
      
      const report = getPerformanceMonitor().getReport();
      
      expect(report.summary.totalMetrics).toBe(3);
      expect(report.summary.goodMetrics).toBe(1);
      expect(report.summary.needsImprovementMetrics).toBe(1);
      expect(report.summary.poorMetrics).toBe(1);
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not create excessive objects during text processing', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Process many texts
      for (let i = 0; i < 100; i++) {
        const text = `测试文本 ${i}`;
        getTextClassName(text);
        optimizeTextForDisplay(text);
        getChineseRatio(text);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });

    it('should clean up performance metrics when cleared', () => {
      // Add some metrics
      for (let i = 0; i < 10; i++) {
        getPerformanceMonitor().recordMetric(`TEST_${i}`, i * 10);
      }
      
      expect(getPerformanceMonitor().getMetrics()).toHaveLength(10);
      
      getPerformanceMonitor().clearMetrics();
      
      expect(getPerformanceMonitor().getMetrics()).toHaveLength(0);
    });
  });

  describe('Font Loading Performance Simulation', () => {
    it('should simulate font loading measurement', () => {
      // Mock document.fonts
      const mockFonts = {
        ready: Promise.resolve(),
      };
      
      // @ts-ignore
      global.document = {
        fonts: mockFonts,
      };
      
      // This would normally be called in the browser
      // measureFontLoading();
      
      // Simulate font loading completion
      getPerformanceMonitor().recordMetric('FONT_LOAD', 1500);
      
      const metrics = getPerformanceMonitor().getMetrics();
      const fontMetric = metrics.find(m => m.name === 'FONT_LOAD');
      
      expect(fontMetric).toBeDefined();
      expect(fontMetric?.value).toBe(1500);
      // Font loading uses generic thresholds, so 1500ms would be 'poor'
      expect(fontMetric?.rating).toBe('poor');
    });
  });

  describe('Batch Processing Performance', () => {
    it('should handle batch text processing efficiently', () => {
      const batchSize = 50;
      const texts = Array(batchSize).fill(0).map((_, i) => 
        `批处理测试文本 ${i} batch processing test ${i}`
      );

      const startTime = performance.now();
      
      const results = texts.map(text => ({
        text,
        className: getTextClassName(text),
        optimized: optimizeTextForDisplay(text),
        ratio: getChineseRatio(text),
      }));
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      expect(results).toHaveLength(batchSize);
      // Should process batch within 50ms
      expect(processingTime).toBeLessThan(50);
      
      // Average time per item should be less than 1ms
      const avgTime = processingTime / batchSize;
      expect(avgTime).toBeLessThan(1);
    });
  });
});