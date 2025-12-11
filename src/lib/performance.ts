/**
 * Performance monitoring utilities for the ABMind Course Portal
 */

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP_GOOD: 2500, // ms
  LCP_NEEDS_IMPROVEMENT: 4000, // ms
  
  // First Input Delay (FID)
  FID_GOOD: 100, // ms
  FID_NEEDS_IMPROVEMENT: 300, // ms
  
  // Cumulative Layout Shift (CLS)
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,
  
  // Custom thresholds
  DATA_LOAD_GOOD: 500, // ms
  TEXT_PROCESSING_GOOD: 10, // ms
  FONT_LOAD_GOOD: 3000, // ms
};

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalMetrics: number;
    goodMetrics: number;
    needsImprovementMetrics: number;
    poorMetrics: number;
  };
  recommendations: string[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            this.recordMetric('LCP', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Navigation timing
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.recordMetric('TTFB', entry.responseStart - entry.requestStart);
            this.recordMetric('DOM_LOAD', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart);
            this.recordMetric('LOAD_COMPLETE', entry.loadEventEnd - entry.loadEventStart);
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation observer not supported');
      }
    }
  }

  recordMetric(name: string, value: number): void {
    const rating = this.getRating(name, value);
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      rating,
    };
    
    this.metrics.push(metric);
    
    // Log performance issues in development
    if (process.env.NODE_ENV === 'development' && rating === 'poor') {
      console.warn(`Poor performance detected: ${name} = ${value}ms`);
    }
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (name) {
      case 'LCP':
        if (value <= PERFORMANCE_THRESHOLDS.LCP_GOOD) return 'good';
        if (value <= PERFORMANCE_THRESHOLDS.LCP_NEEDS_IMPROVEMENT) return 'needs-improvement';
        return 'poor';
      
      case 'FID':
        if (value <= PERFORMANCE_THRESHOLDS.FID_GOOD) return 'good';
        if (value <= PERFORMANCE_THRESHOLDS.FID_NEEDS_IMPROVEMENT) return 'needs-improvement';
        return 'poor';
      
      case 'CLS':
        if (value <= PERFORMANCE_THRESHOLDS.CLS_GOOD) return 'good';
        if (value <= PERFORMANCE_THRESHOLDS.CLS_NEEDS_IMPROVEMENT) return 'needs-improvement';
        return 'poor';
      
      case 'DATA_LOAD':
        if (value <= PERFORMANCE_THRESHOLDS.DATA_LOAD_GOOD) return 'good';
        if (value <= PERFORMANCE_THRESHOLDS.DATA_LOAD_GOOD * 2) return 'needs-improvement';
        return 'poor';
      
      case 'TEXT_PROCESSING':
        if (value <= PERFORMANCE_THRESHOLDS.TEXT_PROCESSING_GOOD) return 'good';
        if (value <= PERFORMANCE_THRESHOLDS.TEXT_PROCESSING_GOOD * 2) return 'needs-improvement';
        return 'poor';
      
      default:
        // Generic thresholds
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getReport(): PerformanceReport {
    const metrics = this.getMetrics();
    const summary = {
      totalMetrics: metrics.length,
      goodMetrics: metrics.filter(m => m.rating === 'good').length,
      needsImprovementMetrics: metrics.filter(m => m.rating === 'needs-improvement').length,
      poorMetrics: metrics.filter(m => m.rating === 'poor').length,
    };

    const recommendations = this.generateRecommendations(metrics);

    return {
      metrics,
      summary,
      recommendations,
    };
  }

  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];
    const poorMetrics = metrics.filter(m => m.rating === 'poor');
    
    poorMetrics.forEach(metric => {
      switch (metric.name) {
        case 'LCP':
          recommendations.push('Consider optimizing images and reducing server response times to improve Largest Contentful Paint');
          break;
        case 'FID':
          recommendations.push('Reduce JavaScript execution time and consider code splitting to improve First Input Delay');
          break;
        case 'CLS':
          recommendations.push('Ensure proper sizing for images and avoid inserting content above existing content');
          break;
        case 'DATA_LOAD':
          recommendations.push('Consider implementing data caching or reducing the amount of data loaded initially');
          break;
        case 'TEXT_PROCESSING':
          recommendations.push('Optimize Chinese text processing algorithms or consider lazy processing for large texts');
          break;
        case 'TTFB':
          recommendations.push('Optimize server response times and consider using a CDN');
          break;
        default:
          recommendations.push(`Consider optimizing ${metric.name} performance`);
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// Utility functions for measuring custom performance
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      getPerformanceMonitor().recordMetric(name, duration);
      resolve(result);
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      getPerformanceMonitor().recordMetric(`${name}_ERROR`, duration);
      reject(error);
    }
  });
}

export function measureSync<T>(
  name: string,
  fn: () => T
): T {
  const startTime = performance.now();
  
  try {
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    getPerformanceMonitor().recordMetric(name, duration);
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    getPerformanceMonitor().recordMetric(`${name}_ERROR`, duration);
    throw error;
  }
}

// Font loading performance
export function measureFontLoading(): void {
  if (typeof window !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(() => {
      const fontLoadTime = performance.now();
      getPerformanceMonitor().recordMetric('FONT_LOAD', fontLoadTime);
    });
  }
}

// Image loading performance
export function measureImageLoading(img: HTMLImageElement, name: string): void {
  const startTime = performance.now();
  
  const onLoad = () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    getPerformanceMonitor().recordMetric(`IMAGE_LOAD_${name}`, duration);
    cleanup();
  };
  
  const onError = () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    getPerformanceMonitor().recordMetric(`IMAGE_LOAD_ERROR_${name}`, duration);
    cleanup();
  };
  
  const cleanup = () => {
    img.removeEventListener('load', onLoad);
    img.removeEventListener('error', onError);
  };
  
  img.addEventListener('load', onLoad);
  img.addEventListener('error', onError);
}

// Export for testing
export { PerformanceMonitor };